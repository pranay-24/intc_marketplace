"use client";  
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { FormResponseService } from '@/lib/firebaseService';

export default function FirebaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [user, setUser] = useState<User | null>(null);
  const [firestoreStatus, setFirestoreStatus] = useState<'testing' | 'connected' | 'error'>('testing');

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test Firestore connection
        const testQuery = query(collection(db, 'formResponses'), limit(1));
        await getDocs(testQuery);
        setFirestoreStatus('connected');
        setConnectionStatus('connected');
      } catch (error) {
        console.error('Firestore error:', error);
        setFirestoreStatus('error');
        setConnectionStatus('error');
      }
    };

    testConnection();

    // Listen for auth changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const testFormResponseService = async () => {
    if (!user) {
      alert('Please sign in first to test form response service');
      return;
    }

    try {
      // Test creating a form response
      const testFormData = {
        userId: user.uid,
        collectionName: 'Test Collection',
        questionsAnswers: { test: 'answer' },
        status: 'in_progress' as const,
      };

      const formId = await FormResponseService.create(testFormData);
      console.log('Created test form response with ID:', formId);

      // Test retrieving it
      const retrieved = await FormResponseService.getById(formId);
      console.log('Retrieved form response:', retrieved);

      // Test updating it
      await FormResponseService.update(formId, { status: 'completed' });
      console.log('Updated form response');

      // Test deleting it
      await FormResponseService.delete(formId);
      console.log('Deleted test form response');

      alert('Form response service test completed successfully! Check console for details.');
    } catch (error) {
      console.error('Form response service test failed:', error);
      alert('Form response service test failed. Check console for details.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Firebase Connection Test</h2>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'testing' ? 'bg-yellow-500' :
            connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span>Overall: {connectionStatus}</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            firestoreStatus === 'testing' ? 'bg-yellow-500' :
            firestoreStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span>Firestore: {firestoreStatus}</span>
        </div>

        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${user ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span>User: {user ? 'Authenticated' : 'Not authenticated'}</span>
        </div>

        {user && (
          <div className="text-sm text-gray-600">
            <p>User ID: {user.uid}</p>
            <p>Email: {user.email}</p>
            <p>Email Verified: {user.emailVerified ? 'Yes' : 'No'}</p>
          </div>
        )}

        {user && firestoreStatus === 'connected' && (
          <button
            onClick={testFormResponseService}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Test Form Response Service
          </button>
        )}
      </div>
    </div>
  );
}