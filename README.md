## URL
https://logi-quiz.com

- 表紙SignInページ下の Let's play quiz now! からログインなしでクイズを楽しめます。
- 下記ログインしてダッシュボード機能等を使ってみてください。
  | アドレス             | パスワード   |   
  | ------------------- | ----------- |   
  | example@example.com | password123 |   

# 貿易実務の知識を定着させよう。
 
- 国際物流の知識を手軽に復習できるクイズアプリです。
- 復習したい内容や学習テーマに合わせて復習することが出来ます。

## 目指した課題解決
  ### ペルソナ
  - 国際物流業界の若手社員
  - メーカーや商社で生産管理業務を行っている若手社員社員
  
  ### ペルソナの課題
  | 課題                       | 解決策                        |
  | ------------------------- | ---------------------------- |
  | 気軽に遊びながら学びたい      |  ログインせずにクイズを楽しめる   |
  | 通勤時間を有効活用したい      | クイズのタイマー機能で学習を効率化 |
  | 続けられるか不安      	     |  豊富な問題数と学習積み上げ機能   |


  ### 課題を解決したいと感じた背景、意図
- 私は国際物流業界での経験から、このアプリを通じて特定の課題に対する提案を行います。
- 私を含め、現場では日々の業務に追われる中、覚えなければならない知識の量に苦しんでいる若手社員が多く存在しており、その課題を少しでも改善したいと考えています。
- インターネット上や社内の共有資料には詳細な解説が記載されていますが、それを参照して付け焼き刃的な顧客対応は可能です。しかしながら、忙しい業務の中でそれらを事前に学び、反復して練習する機会が欠如しています。
- 初めて聞く用語の説明を求めらた時、また数ヶ月後に類似した案件があった際に、知識が定着しておらず、瞬時に適切な顧客対応ができないことで、現場において品質低下につながっています。
- このような状況を緩和できるのが、ゲーム感覚で楽しく、かつ手軽に国際物流の知識を復習できるこのクイズアプリです。


## 使用技術
### バックエンド
* 言語: Ruby (v3.2.2)
* フレームワーク: Rails (v7.0.6)
* テストフレームワーク: RSpec

### フロントエンド
* ライブラリ: React (v18.2.0)
* 言語: TypeScript (一部)
* UIコンポーネント: Material UI (v5)
* テストフレームワーク: Jest

### インフラ
* データベース: MySQL (v8.0.33)
* コンテナ化: Docker/Docker-compose
* クラウド: AWS (ECR, ECS, EC2, VPC, RDS, ACM, ELB, Route53, CloudWatch)
* リバースプロキシ: Nginx
* アプリケーションホスティング: Vercel

### 開発環境/その他
* バージョン管理: Git/GitHub (擬似チーム開発をIssues, Pull Requestsで管理)
* コードエディタ: VScode
* APIテストツール: Postman
* データベース管理ツール: Sequel Ace
* データモデリング: dbdiagram.io
* フローチャート作成: diagrams.net


## 実装機能
### ユーザー側
* 認証機能
    * ユーザー新規登録
    * ログイン/ログアウト (トークン認証)
    * パスワード変更
* ダッシュボード
    * 学習時間、正解数の視覚化
    * カレンダーによる学習積み上げ表示
* クイズ機能
    * セクション選択
    * クイズ回答
    * タイムトラッキング機能
    * 解説機能
* 問い合わせ送信機能(Googleフォームを使用)

### 管理者側
* 認証機能
    * 管理者ログイン/ログアウト (トークン認証)
* クイズ管理
    * クイズの作成・更新・削除


## ER図
![ER Diagram](frontend/app/public/dbdiagram_ERchart.png)

## インフラ構成図
![Infra Chart](frontend/app/public/diagrams_infra.png)

## 画面
### Sign In (未ログイン)
![Sign In](frontend/app/public/signin.png)

### Home (未ログイン)
![Home](frontend/app/public/home.png)

### Section (未ログイン)
![Section](frontend/app/public/section.png)

### Quiz
![Quiz](frontend/app/public/quiz.png)

### Quiz Timer
![Quiz Timer](frontend/app/public/quiz_timer.png)

### Explanation
![Explanation](frontend/app/public/explanation.png)

### Dashboard
![Dashboard](frontend/app/public/dashboard_display.png)

### Create Section
![Create Section](frontend/app/public/create_section.png)

### Edit Section
![Edit Section](frontend/app/public/edit_section.png)

### Create Quiz
![Create Quiz](frontend/app/public/create_quiz.png)

### Edit Quiz
![Edit Quiz](frontend/app/public/edit_quiz.png)

### Delete Quiz
![Delete Quiz](frontend/app/public/delete_quiz.png)

### Update Quiz
![Update Quiz](frontend/app/public/update_quiz.png)