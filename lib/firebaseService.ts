import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { FormResponse, FamilyMember, FirebaseFormResponse } from './types';

// Collection names
const COLLECTIONS = {
  FORM_RESPONSES: 'formResponses',
  FAMILY_MEMBERS: 'familyMembers',
};

// Form Response Service
export class FormResponseService {
  static async create(formResponse: Omit<FormResponse, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.FORM_RESPONSES), {
        ...formResponse,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating form response:', error);
      throw error;
    }
  }

  static async update(id: string, updates: Partial<FormResponse>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.FORM_RESPONSES, id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating form response:', error);
      throw error;
    }
  }

  static async getById(id: string): Promise<FormResponse | null> {
    try {
      const docRef = doc(db, COLLECTIONS.FORM_RESPONSES, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as FormResponse;
      }
      return null;
    } catch (error) {
      console.error('Error getting form response:', error);
      throw error;
    }
  }

  static async getByUserId(userId: string, status?: string): Promise<FormResponse[]> {
    try {
      let q = query(
        collection(db, COLLECTIONS.FORM_RESPONSES),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      if (status) {
        q = query(
          collection(db, COLLECTIONS.FORM_RESPONSES),
          where('userId', '==', userId),
          where('status', '==', status),
          orderBy('createdAt', 'desc')
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FormResponse));
    } catch (error) {
      console.error('Error getting form responses by user:', error);
      throw error;
    }
  }

  static async getLatestInProgress(userId: string): Promise<FormResponse | null> {
    try {
      const q = query(
        collection(db, COLLECTIONS.FORM_RESPONSES),
        where('userId', '==', userId),
        where('status', '==', 'in_progress'),
        orderBy('createdAt', 'desc'),
        limit(1)
      );

      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as FormResponse;
      }
      return null;
    } catch (error) {
      console.error('Error getting latest in-progress form:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.FORM_RESPONSES, id));
    } catch (error) {
      console.error('Error deleting form response:', error);
      throw error;
    }
  }

  static async upsert(formResponse: FormResponse): Promise<string> {
    if (formResponse.id) {
      await this.update(formResponse.id, formResponse);
      return formResponse.id;
    } else {
      return await this.create(formResponse);
    }
  }
}

// Family Member Service
export class FamilyMemberService {
  static async create(familyMember: Omit<FamilyMember, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.FAMILY_MEMBERS), {
        ...familyMember,
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating family member:', error);
      throw error;
    }
  }

  static async update(id: string, updates: Partial<FamilyMember>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.FAMILY_MEMBERS, id);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Error updating family member:', error);
      throw error;
    }
  }

  static async getByFormResponseId(formResponseId: string): Promise<FamilyMember[]> {
    try {
      const q = query(
        collection(db, COLLECTIONS.FAMILY_MEMBERS),
        where('formResponseId', '==', formResponseId),
        orderBy('createdAt', 'asc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FamilyMember));
    } catch (error) {
      console.error('Error getting family members:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.FAMILY_MEMBERS, id));
    } catch (error) {
      console.error('Error deleting family member:', error);
      throw error;
    }
  }

  static async deleteByFormResponseId(formResponseId: string): Promise<void> {
    try {
      const q = query(
        collection(db, COLLECTIONS.FAMILY_MEMBERS),
        where('formResponseId', '==', formResponseId)
      );

      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Error deleting family members by form response:', error);
      throw error;
    }
  }
}