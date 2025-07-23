'use client'

import ComicDetail from './ComicDetail'
import { usePreferences } from '../../context/PreferencesContext'
import { useEffect, useMemo } from 'react'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../../../lib/firebase'
import { useParams } from 'next/navigation'

export default function ComicDetailPage() {
  const params = useParams<{ idKomik: string }>()
  const idKomik = params.idKomik
  const { preferences } = usePreferences()

  // Apply user preferences
  const userLanguages = useMemo(() => preferences?.languages || ['id'], [preferences?.languages]) // Default to Indonesian if no preferences

  useEffect(() => {
    async function fetchComic() {
      try {
        const comicDoc = await getDoc(doc(db, 'komik', idKomik));
        if (comicDoc.exists()) {
          // data diambil tapi tidak digunakan
        }
      } catch (error) {
        console.error('Error fetching comic:', error);
      }
    }
    if (idKomik) fetchComic();
  }, [idKomik, userLanguages]);

  return <ComicDetail idKomik={idKomik} />;
}