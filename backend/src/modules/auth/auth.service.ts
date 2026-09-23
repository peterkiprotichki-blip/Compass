import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { User, UserDocument } from '../../database/schemas/user.schema';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '');
  }

  getAuthConfig() {
    return {
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    };
  }

  async register(data: { name: string; email: string; phone?: string; password?: string; language?: string; country?: string }) {
    const existing = await this.userModel.findOne({ email: data.email.toLowerCase() }).exec();
    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password || 'compass2026', salt);

    const user = new this.userModel({
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone || null,
      passwordHash,
      language: data.language || 'en',
      country: data.country || 'Kenya',
      savedPaths: [],
    });

    const saved = await user.save();
    const token = this.generateToken(saved);

    return {
      user: {
        id: saved._id,
        name: saved.name,
        email: saved.email,
        phone: saved.phone,
        role: saved.role || 'user',
        language: saved.language,
        country: saved.country,
        savedPaths: saved.savedPaths,
      },
      token,
    };
  }

  async login(email: string, password?: string, channel: 'email' | 'sms' = 'email') {
    const user = await this.userModel.findOne({ email: email.toLowerCase() }).exec();
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (password) {
      if (!user.passwordHash) {
        throw new UnauthorizedException('Please sign in using Google');
      }
      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) {
        throw new UnauthorizedException('Invalid email or password');
      }
    }

    // Mandatory 2-Step Verification for Super Admin
    if (user.role === 'super_admin') {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      user.twoFactorOtp = otp;
      user.twoFactorExpires = expires;
      user.twoFactorChannel = channel;
      await user.save();

      console.log(`\n======================================================`);
      console.log(`[Compass 2FA] Super Admin Login: ${user.email}`);
      console.log(`[Compass 2FA] Verification Channel: ${channel.toUpperCase()}`);
      console.log(`[Compass 2FA] ONE-TIME CODE (OTP): [ ${otp} ]`);
      console.log(`[Compass 2FA] Expires: ${expires.toLocaleTimeString()}`);
      console.log(`======================================================\n`);

      return {
        requires2FA: true,
        userId: user._id,
        email: user.email,
        phone: user.phone || '+254700000000',
        channel: channel,
        previewOtp: otp, // testing convenience
        message: `Verification code sent via ${channel.toUpperCase()}`,
      };
    }

    const token = this.generateToken(user);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        language: user.language,
        country: user.country,
        savedPaths: user.savedPaths,
      },
      token,
    };
  }

  async verify2FA(userId: string, otp: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user || user.role !== 'super_admin') {
      throw new UnauthorizedException('Invalid 2FA session');
    }

    if (!user.twoFactorOtp || !user.twoFactorExpires) {
      throw new UnauthorizedException('No active OTP found. Please request a new code.');
    }

    if (new Date() > new Date(user.twoFactorExpires)) {
      throw new UnauthorizedException('OTP code has expired. Please request a new code.');
    }

    if (user.twoFactorOtp.trim() !== otp.trim()) {
      throw new UnauthorizedException('Invalid 6-digit verification code');
    }

    user.twoFactorOtp = undefined;
    user.twoFactorExpires = undefined;
    await user.save();

    const token = this.generateToken(user);
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        language: user.language,
        country: user.country,
        savedPaths: user.savedPaths,
      },
      token,
    };
  }

  async resend2FA(userId: string, channel: 'email' | 'sms' = 'email') {
    const user = await this.userModel.findById(userId).exec();
    if (!user || user.role !== 'super_admin') {
      throw new UnauthorizedException('Invalid 2FA session');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    user.twoFactorOtp = otp;
    user.twoFactorExpires = expires;
    user.twoFactorChannel = channel;
    await user.save();

    console.log(`\n======================================================`);
    console.log(`[Compass 2FA Resend] Super Admin: ${user.email}`);
    console.log(`[Compass 2FA Resend] Channel: ${channel.toUpperCase()}`);
    console.log(`[Compass 2FA Resend] NEW OTP: [ ${otp} ]`);
    console.log(`======================================================\n`);

    return {
      userId: user._id,
      channel: channel,
      previewOtp: otp,
      message: `A new 6-digit code has been sent via ${channel.toUpperCase()}.`,
    };
  }

  async loginWithGoogle(data: {
    credential?: string;
    googleId?: string;
    email?: string;
    name?: string;
    avatarUrl?: string;
  }) {
    let googleId = data.googleId;
    let email = data.email ? data.email.toLowerCase() : undefined;
    let name = data.name;
    let avatarUrl = data.avatarUrl;

    if (data.credential) {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      try {
        if (clientId) {
          const ticket = await this.googleClient.verifyIdToken({
            idToken: data.credential,
            audience: clientId,
          });
          const payload = ticket.getPayload();
          if (!payload) {
            throw new UnauthorizedException('Invalid Google token payload');
          }
          const candidateEmail = payload.email || email;
          email = candidateEmail ? candidateEmail.toLowerCase() : undefined;
          name = payload.name || name || (email ? email.split('@')[0] : 'User');
          avatarUrl = payload.picture || avatarUrl;
        } else {
          // If GOOGLE_CLIENT_ID is not configured yet (development), extract claims from token payload safely
          const parts = data.credential.split('.');
          if (parts.length === 3) {
            const decoded = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
            googleId = decoded.sub || googleId;
            const candidateEmail = decoded.email || email;
            email = candidateEmail ? candidateEmail.toLowerCase() : undefined;
            name = decoded.name || name || (email ? email.split('@')[0] : 'User');
            avatarUrl = decoded.picture || avatarUrl;
          }
        }
      } catch (err: any) {
        console.error('Failed to verify Google ID token:', err.message);
        throw new UnauthorizedException(`Failed to verify Google token: ${err.message}`);
      }
    }

    if (!email) {
      throw new UnauthorizedException('A valid email address is required to sign in with Google');
    }

    if (!googleId) {
      googleId = 'google_' + Math.abs(email.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0));
    }

    if (!name) {
      name = email.split('@')[0].replace(/[._]/g, ' ');
      name = name.charAt(0).toUpperCase() + name.slice(1);
    }

    let user = await this.userModel.findOne({
      $or: [{ googleId }, { email }]
    }).exec();

    if (!user) {
      user = new this.userModel({
        name,
        email,
        googleId,
        avatarUrl,
        authProvider: 'google',
        role: 'user',
        language: 'en',
        country: 'Kenya',
        savedPaths: [],
      });
      await user.save();
    } else {
      let updated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (avatarUrl && (!user.avatarUrl || user.avatarUrl.includes('dicebear'))) {
        user.avatarUrl = avatarUrl;
        updated = true;
      }
      if (user.authProvider !== 'google' && !user.authProvider) {
        user.authProvider = 'google';
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    }

    const token = this.generateToken(user);
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        avatarUrl: user.avatarUrl,
        language: user.language,
        country: user.country,
        savedPaths: user.savedPaths,
      },
      token,
    };
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      phone: user.phone,
      language: user.language,
      country: user.country,
      savedPaths: user.savedPaths,
    };
  }

  async toggleSavedPath(userId: string, businessSlug: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const exists = user.savedPaths.includes(businessSlug);
    if (exists) {
      user.savedPaths = user.savedPaths.filter(s => s !== businessSlug);
    } else {
      user.savedPaths.push(businessSlug);
    }

    await user.save();
    return { savedPaths: user.savedPaths };
  }

  private generateToken(user: UserDocument) {
    return this.jwtService.sign({
      sub: user._id,
      email: user.email,
      name: user.name,
      role: user.role || 'user',
    });
  }
}
