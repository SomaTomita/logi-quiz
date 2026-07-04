# logi-quiz ER Diagram

`backend/db/schema.rb`（version: 2026_07_04_020907）とモデルの関連（`has_many`/`has_one`/`belongs_to`）から作成。Mermaidのため、GitHub上のMarkdownプレビューでそのままレンダリングされる。

`er-diagram-preview.png` はローカル確認用。以下のコマンドで高解像度に再生成できる（`-s`はPuppeteerのスケール係数、値を上げるほど鮮明になる）:

```bash
npx -y @mermaid-js/mermaid-cli -i er.mmd -o er-diagram-preview.png -w 1600 -H 1200 -s 4 -b white
```

（`er.mmd` は上記の ```mermaid ``` ブロック部分だけを抜き出した一時ファイル。mmdc は `.md` を直接入力にもでき、`-i er-diagram.md -o er-diagram-preview.png` と指定すると図を自動抽出して `er-diagram-preview-1.png` という名前で出力される。）

```mermaid
erDiagram
    USERS ||--o{ STUDY_LOGS : logs
    USERS ||--o{ QUESTION_ATTEMPTS : attempts
    USERS ||--o{ USER_QUESTION_STATES : tracks
    USERS ||--o{ USER_SECTIONS : clears

    SECTIONS ||--o{ QUESTIONS : contains
    SECTIONS ||--o{ USER_SECTIONS : "cleared by"

    QUESTIONS ||--o{ CHOICES : has
    QUESTIONS ||--|| EXPLANATIONS : has
    QUESTIONS ||--o{ QUESTION_ATTEMPTS : "answered in"
    QUESTIONS ||--o{ USER_QUESTION_STATES : "tracked in"

    CHOICES ||--o{ QUESTION_ATTEMPTS : "selected in"

    USERS {
        bigint id PK
        string email UK
        string encrypted_password
        string uid
        string provider
        boolean admin
        integer total_play_time
        integer total_questions_cleared
        datetime created_at
    }

    SECTIONS {
        bigint id PK
        string section_name
        string locale
        datetime created_at
    }

    QUESTIONS {
        bigint id PK
        bigint section_id FK
        text question_text
        datetime created_at
    }

    CHOICES {
        bigint id PK
        bigint question_id FK
        string choice_text
        boolean is_correct
    }

    EXPLANATIONS {
        bigint id PK
        bigint question_id FK
        text explanation_text
    }

    QUESTION_ATTEMPTS {
        bigint id PK
        bigint user_id FK
        bigint question_id FK
        bigint choice_id FK
        boolean correct
        integer response_time_ms
        datetime created_at
    }

    USER_QUESTION_STATES {
        bigint id PK
        bigint user_id FK
        bigint question_id FK
        integer box_level
        datetime next_review_at
        datetime last_reviewed_at
        integer attempt_count
        integer correct_count
    }

    USER_SECTIONS {
        bigint id PK
        bigint user_id FK
        bigint section_id FK
        datetime cleared_at
        integer correct_answers_count
    }

    STUDY_LOGS {
        bigint id PK
        bigint user_id FK
        date date
        integer study_time
    }
```

## 補足

- `EXPLANATIONS.question_id` にDB上のunique制約は無いが、`Question#explanation` は `has_one` のためアプリケーションレベルで1問1解説として扱う。
- `QUESTION_ATTEMPTS.choice_id` はnull許容（タイムアップ時などchoice未選択のケースがあるため）。
- `USER_QUESTION_STATES` はLeitner box方式のSRS（間隔反復）進捗を保持する（`box_level`, `next_review_at` 等）。
