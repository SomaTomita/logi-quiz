# 貿易実務の知識を定着させよう。(作成途中)
 
- 国際物流の知識を手軽に復習できるクイズアプリです。
- 復習したい内容や学習テーマに合わせて復習することが出来ます。

## 目指した課題解決
  ### ペルソナ
  - 国際物流業界の若手社員
  - メーカーや商社で生産管理部門に配属され、国際輸送の勉強を始めたい社員
  
  ### ペルソナの課題
  | 課題                       | 解決策                |
  | -------------------------- | ---------------------|
  | レビューする時間がない	  | セクション別に復習できる機能   |
  | 通勤時間を有効活用したい      |   クイズのタイマー機能で効率化   |
  | 覚えることが多すぎる      	   |   豊富なクイズ数と解説ページ  |

  ### 課題を解決したいと感じた背景、意図
  - 私は国際物流業界での経験から、このアプリを通じて特定の課題に対する提案を行います。
  - 現場では日々の業務に追われているため、先輩に質問しにくい状況や、覚えなければならない知識の量に苦しんでいる若手社員が多く存在しており、
　 その課題を少しでも改善したいと考えています。
  - インターネット上や社内の共有資料には、詳細な解説が記載されており、それを見て付け焼き刃的に顧客対応はできる一方、
	忙しい業務の中で、それらを事前に学んでおく機会や繰り返し学び血肉にする機会が欠如しており、初めて聞く用語の説明を求められたり、
	数ヶ月後に似た案件があった際に知識の解像度が低く対応できない若手社員が散見され、品質低下につながっています。
  - このような状況の中、楽しく手軽に国際物流の知識を復習できるクイズがあれば、業務の役立つのではないでしょうか。
  - また、国際物流の知識を復習するためのクイズ形式の日本語アプリケーションは存在しません。


##使用技術

- バックエンド
* Ruby 3.2.2
* Ruby on Rails 6.0.0

* MySQL 5.6
* Nginx
* Puma

- フロントエンド
* HTML/CSS
* Javascript(お気に入り登録)

- インフラ・開発環境
未定


## 実装予定機能
* 認証機能
    * ログイン機能（トークン認証）
    * ユーザー新規登録機能
    * ログアウト機能
* ユーザー関連
    * プロフィール画像変更機能
    * パスワード変更機能
* 問い合わせメール送信機能

* 認証機能
    * 管理者ログイン機能（トークン認証）
    * 管理者ログアウト機能
* ユーザー関連
    * ユーザー削除機能
* クイズ関連
    * クイズ作成・更新・削除機能 (セクションも同様)
