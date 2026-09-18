import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  QuestionnaireResponse,
  AssessmentResult,
  Business,
  Journey,
  UserProfile,
  AdminStatsResponse,
  AdminApplicantItem,
  AdminApplicationItem,
  AdminJourneyItem,
  AdminGrowIntakeItem,
} from '../../models/compass.models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? '/api'
    : 'http://localhost:3000/api';

  getQuestions(): Observable<QuestionnaireResponse> {
    return this.http.get<QuestionnaireResponse>(`${this.baseUrl}/assessment/questions`);
  }

  submitAssessment(answers: Record<string, any>, userId?: string): Observable<AssessmentResult> {
    return this.http.post<AssessmentResult>(`${this.baseUrl}/assessment/submit`, {
      answers,
      userId,
    });
  }

  getResultById(id: string): Observable<AssessmentResult> {
    return this.http.get<AssessmentResult>(`${this.baseUrl}/assessment/results/${id}`);
  }

  getUserResults(userId: string): Observable<AssessmentResult[]> {
    return this.http.get<AssessmentResult[]>(`${this.baseUrl}/assessment/user/${userId}`);
  }

  getBusinesses(category?: string, capitalBand?: string): Observable<Business[]> {
    let url = `${this.baseUrl}/businesses`;
    const params: string[] = [];
    if (category) params.push(`category=${encodeURIComponent(category)}`);
    if (capitalBand) params.push(`capitalBand=${encodeURIComponent(capitalBand)}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return this.http.get<Business[]>(url);
  }

  getBusinessBySlug(slug: string): Observable<Business> {
    return this.http.get<Business>(`${this.baseUrl}/businesses/${slug}`);
  }

  startJourney(userId: string, businessSlug: string): Observable<Journey> {
    return this.http.post<Journey>(`${this.baseUrl}/journeys/start`, {
      userId,
      businessSlug,
    });
  }

  getUserJourneys(userId: string): Observable<Journey[]> {
    return this.http.get<Journey[]>(`${this.baseUrl}/journeys/user/${userId}`);
  }

  getJourneyById(id: string): Observable<Journey> {
    return this.http.get<Journey>(`${this.baseUrl}/journeys/${id}`);
  }

  toggleJourneyTask(journeyId: string, taskId: string): Observable<Journey> {
    return this.http.patch<Journey>(`${this.baseUrl}/journeys/${journeyId}/toggle-task`, {
      taskId,
    });
  }

  submitGrowIntake(payload: {
    userId?: string;
    businessType: string;
    operatingDuration: string;
    monthlySalesRange: string;
    biggestChallenge: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/growth/intake`, payload);
  }

  toggleSavePath(userId: string, businessSlug: string): Observable<{ savedPaths: string[] }> {
    return this.http.post<{ savedPaths: string[] }>(`${this.baseUrl}/auth/save-path`, {
      userId,
      businessSlug,
    });
  }

  chatWithAi(messages: { role: 'user' | 'model'; text: string }[], context?: string): Observable<{ reply: string }> {
    return this.http.post<{ reply: string }>(`${this.baseUrl}/ai/chat`, {
      messages,
      context,
    });
  }

  loginWithGoogle(payload: { googleId: string; email: string; name: string; avatarUrl?: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/google`, payload);
  }

  // Super Admin Endpoints
  getAdminStats(): Observable<AdminStatsResponse> {
    return this.http.get<AdminStatsResponse>(`${this.baseUrl}/admin/stats`);
  }

  getAdminApplicants(): Observable<AdminApplicantItem[]> {
    return this.http.get<AdminApplicantItem[]>(`${this.baseUrl}/admin/applicants`);
  }

  getAdminApplications(): Observable<AdminApplicationItem[]> {
    return this.http.get<AdminApplicationItem[]>(`${this.baseUrl}/admin/applications`);
  }

  getAdminApplicationDetail(id: string): Observable<{ result: any; assessment: any; user: any }> {
    return this.http.get<{ result: any; assessment: any; user: any }>(`${this.baseUrl}/admin/applications/${id}`);
  }

  getAdminJourneys(): Observable<AdminJourneyItem[]> {
    return this.http.get<AdminJourneyItem[]>(`${this.baseUrl}/admin/journeys`);
  }

  getAdminGrowIntakes(): Observable<AdminGrowIntakeItem[]> {
    return this.http.get<AdminGrowIntakeItem[]>(`${this.baseUrl}/admin/grow-intakes`);
  }
}
