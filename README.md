# Hemu — Personal Portfolio & Blog

개인 포트폴리오, 블로그, 방명록 기능을 갖춘 풀스택 웹 애플리케이션.

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | React 19 + TypeScript, Vite 7, Tailwind CSS 4 |
| Backend | Spring Boot 3.5, Java 17, JPA/Hibernate |
| DB | PostgreSQL |
| 인증 | Spring Security + JWT |
| 파일 업로드 | Supabase Storage |
| 배포 | Vercel (FE) / Railway (BE) |

---

## 프로젝트 구조

```
hemu/
├── frontend/   # React + TypeScript SPA
└── backend/    # Spring Boot REST API
```

---

## Frontend

### 주요 페이지

| 경로 | 설명 |
|------|------|
| `/` | 홈 — 히어로, 대표 프로젝트, 스킬 |
| `/projects` | 프로젝트 목록 |
| `/projects/:id` | 프로젝트 상세 |
| `/about` | 소개 페이지 |
| `/guestbook` | 방명록 |
| `/admin` | 관리자 로그인 |
| `/admin/dashboard` | 관리 대시보드 |
| `/admin/posts/new` | 블로그 글 작성 |
| `/admin/projects/new` | 프로젝트 등록 |

### 핵심 구현

- **인증**: Zustand authStore + axios 인터셉터로 JWT 자동 첨부
- **라우팅**: `PrivateRoute`로 관리자 페이지 접근 제어
- **마크다운**: react-md-editor 작성 / react-markdown + react-syntax-highlighter 렌더링
- **테마**: ThemeProvider로 라이트/다크 모드 전환
- **배포**: `vercel.json`에 SPA rewrites 설정 (`/*` → `/index.html`)

---

## Backend

### 도메인 구조 (DDD)

```
com.portfolio.domain/
├── auth/       # 관리자 로그인, JWT 발급
├── post/       # 블로그 게시글 CRUD + 페이지네이션 + 태그 필터
├── project/    # 포트폴리오 프로젝트 CRUD
├── guestbook/  # 방명록 (비밀글, 비밀번호 삭제 지원)
├── tag/        # 게시글 태그
└── upload/     # Supabase Storage 파일 업로드
```

### API 엔드포인트

**인증**
```
POST /api/auth/login
```

**게시글**
```
GET    /api/posts          # 목록 (pagination, tag 필터)
GET    /api/posts/{id}     # 상세 + 조회수 증가
POST   /api/posts          # 작성 (인증 필요)
PUT    /api/posts/{id}     # 수정 (인증 필요)
DELETE /api/posts/{id}     # 삭제 (인증 필요)
```

**프로젝트**
```
GET    /api/projects
GET    /api/projects/{id}
POST   /api/projects       # 인증 필요
PUT    /api/projects/{id}  # 인증 필요
DELETE /api/projects/{id}  # 인증 필요
```

**방명록**
```
GET    /api/guestbook              # 비밀글은 관리자만 조회
POST   /api/guestbook              # 작성 (비밀번호 설정 가능)
DELETE /api/guestbook/{id}         # 비밀번호로 삭제
DELETE /api/guestbook/{id}/admin   # 관리자 삭제 (인증 필요)
```

### 주요 환경 변수

```
ADMIN_PASSWORD      # 관리자 비밀번호
JWT_SECRET          # JWT 서명 키
JWT_EXPIRATION      # 토큰 만료 시간 (ms)
ALLOWED_ORIGIN      # CORS 허용 도메인
SUPABASE_URL        # Supabase 프로젝트 URL
SUPABASE_KEY        # Supabase service key
SUPABASE_BUCKET     # 스토리지 버킷 이름
```
