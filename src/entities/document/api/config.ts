import { createKey } from '@/shared/api/lib/create-key'

const DOCUMENTS = 'documents'

export const DOCUMENT_ENDPOINTS = {
  // GET
  // 모든 문서 가져오기
  getAllDocuments: `/${DOCUMENTS}`,
  // 단일 문서 가져오기
  getSingleDocument: (documentId: number) => `/${DOCUMENTS}/${documentId}`,
  // 사용자의 비공개된 문서 수
  getIsNotPublicDocuments: `/${DOCUMENTS}/not-public`,
  // 북마크된 모든 문서 가져오기
  getBookmarkedDocuments: `/${DOCUMENTS}/bookmarked`,
  // 공개된 문서 탐색
  getPublicDocuments: `/${DOCUMENTS}/public`,
  // 공개된 문서 정보 조회(+ 상세정보)
  getPublicSingleDocument: (documentId: number) => `/${DOCUMENTS}/${documentId}/public`,
  // 문서에 해당하는 모든 퀴즈 가져오기
  getDocumentQuizzes: (documentId: number) => `/${DOCUMENTS}/${documentId}/quizzes`,
  // 복습 필요한 문서 가져오기
  getDocumentsNeedingReview: `/${DOCUMENTS}/review-need-documents`,
  // 퀴즈 다운로드
  downloadQuiz: (documentId: number) => `/${DOCUMENTS}/${documentId}/download-quiz`,

  // POST
  // 문서 생성
  createDocument: `/${DOCUMENTS}`,
  // 문서 신고하기
  createDocumentComplaint: (documentId: number) => `/${DOCUMENTS}/${documentId}/complaint`,
  // 북마크 하기
  createDocumentBookmark: (documentId: number) => `/${DOCUMENTS}/${documentId}/bookmark`,
  // 문서에서 추가 퀴즈 생성
  addQuizzes: (documentId: number) => `/${DOCUMENTS}/${documentId}/add-quizzes`,
  // 퀴즈 시작하기 (퀴즈 세트 생성)
  createQuizSet: (documentId: number) => `/${DOCUMENTS}/${documentId}/quiz-sets`,
  // 문서 검색
  searchDocument: `/${DOCUMENTS}/search`,
  // 공개된 문서 검색
  searchPublicDocuments: `/${DOCUMENTS}/public/search`,

  // PATCH
  // 문서 공개여부 변경
  updateDocumentIsPublic: (documentId: number) => `/${DOCUMENTS}/${documentId}/update-public`,
  // 문서 이름 변경
  updateDocumentName: (documentId: number) => `/${DOCUMENTS}/${documentId}/update-name`,
  // 문서 이모지 변경
  updateDocumentEmoji: (documentId: number) => `/${DOCUMENTS}/${documentId}/update-emoji`,
  // 문서 내용 업데이트
  updateDocumentContent: (documentId: number) => `/${DOCUMENTS}/${documentId}/update-content`,
  // 문서 카테고리 변경
  updateDocumentCategory: (documentId: number) => `/${DOCUMENTS}/${documentId}/update-category`,
  // 문서 이동
  moveDocument: `/${DOCUMENTS}/move`,

  // DELETE
  // 북마크 취소
  deleteDocumentBookmark: (documentId: number) => `/${DOCUMENTS}/${documentId}/delete`,
  // 문서 삭제
  deleteDocument: `/${DOCUMENTS}/delete`,
}

export const DOCUMENT_KEYS = {
  root: createKey(DOCUMENTS),
  // GET
  getAllDocuments: createKey(DOCUMENTS, DOCUMENT_ENDPOINTS.getAllDocuments),
  getSingleDocument: (documentId: number) => createKey(DOCUMENTS, DOCUMENT_ENDPOINTS.getSingleDocument(documentId)),
  getIsNotPublicDocuments: createKey(DOCUMENTS, DOCUMENT_ENDPOINTS.getIsNotPublicDocuments),
  getBookmarkedDocuments: createKey(DOCUMENTS, DOCUMENT_ENDPOINTS.getBookmarkedDocuments),
  getPublicDocuments: createKey(DOCUMENTS, DOCUMENT_ENDPOINTS.getPublicDocuments),
  getPublicSingleDocument: (documentId: number) =>
    createKey(DOCUMENTS, DOCUMENT_ENDPOINTS.getPublicSingleDocument(documentId)),
  getDocumentQuizzes: (documentId: number) => createKey(DOCUMENTS, DOCUMENT_ENDPOINTS.getDocumentQuizzes(documentId)),
  getDocumentsNeedingReview: createKey(DOCUMENTS, DOCUMENT_ENDPOINTS.getDocumentsNeedingReview),
  downloadQuiz: (documentId: number) => createKey(DOCUMENTS, DOCUMENT_ENDPOINTS.downloadQuiz(documentId)),

  // POST
  createDocument: createKey(DOCUMENTS, DOCUMENT_ENDPOINTS.createDocument),
  complaintDocument: (documentId: number) =>
    createKey(DOCUMENTS, DOCUMENT_ENDPOINTS.createDocumentComplaint(documentId)),
  createDocumentComplaint: (documentId: number) =>
    createKey(DOCUMENTS, DOCUMENT_ENDPOINTS.createDocumentComplaint(documentId)),
  bookmarkDocument: (documentId: number) => createKey(DOCUMENTS, DOCUMENT_ENDPOINTS.createDocumentBookmark(documentId)),
  createDocumentBookmark: (documentId: number) =>
    createKey(DOCUMENTS, DOCUMENT_ENDPOINTS.createDocumentBookmark(documentId)),
  addQuizzes: createKey(DOCUMENTS, 'addQuizzes'),
  createQuizSet: (documentId: number) => createKey(DOCUMENTS, DOCUMENT_ENDPOINTS.createQuizSet(documentId)),
  searchDocument: createKey(DOCUMENTS, DOCUMENT_ENDPOINTS.searchDocument),
  searchPublicDocuments: createKey(DOCUMENTS, DOCUMENT_ENDPOINTS.searchPublicDocuments),

  // PATCH
  updateDocumentIsPublic: (documentId: number) =>
    createKey(DOCUMENTS, DOCUMENT_ENDPOINTS.updateDocumentIsPublic(documentId)),
  updateDocumentContent: (documentId: number) =>
    createKey(DOCUMENTS, DOCUMENT_ENDPOINTS.updateDocumentContent(documentId)),
  updateDocumentCategory: (documentId: number) =>
    createKey(DOCUMENTS, DOCUMENT_ENDPOINTS.updateDocumentCategory(documentId)),
  moveDocument: createKey(DOCUMENTS, DOCUMENT_ENDPOINTS.moveDocument),

  // DELETE
  deleteDocumentBookmark: (documentId: number) =>
    createKey(DOCUMENTS, DOCUMENT_ENDPOINTS.deleteDocumentBookmark(documentId)),
  deleteDocument: createKey(DOCUMENTS, DOCUMENT_ENDPOINTS.deleteDocument),
}
