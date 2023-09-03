require 'rails_helper'

RSpec.describe User, type: :model do
  it "有効なファクトリを持つ" do
    expect(build(:user)).to be_valid
  end


  describe 'バリデーション' do
    it 'メールがないと無効である' do
      user = build(:user, email: nil)
      expect(user).not_to be_valid
    end

    it 'パスワードが短い場合無効である' do
      user = build(:user, password: '12345', password_confirmation: '12345')
      expect(user).not_to be_valid
    end

    it 'メールアドレスが既に存在する場合無効である' do
      create(:user, email: 'test@example.com')
      user = build(:user, email: 'test@example.com')
      expect(user).not_to be_valid
    end

    it 'パスワードが存在し、パスワード確認が空の場合無効である' do
      user = build(:user, password_confirmation: '')
      expect(user).not_to be_valid
    end
  end

  
  describe 'アソシエーション' do
    it 'ユーザーが削除された場合、関連するuser_sectionsも削除される' do
      user = create(:user)
      create_list(:user_section, 5, user: user)  # 複数のuser_sectionsを作成
      expect { user.destroy }.to change(UserSection, :count).by(-5)
    end

    it 'ユーザーが削除された場合、関連するstudy_logも削除される' do
      user = create(:user)
      create_list(:study_log, 3, user: user)  # 複数のstudy_logsを作成
      expect { user.destroy }.to change(StudyLog, :count).by(-3)
    end
  end
end
