FactoryBot.define do
    factory :study_log do
      user
      date { Faker::Date.backward } # ランダムな日付を生成
      study_time { rand(1..20) } # 1から20回セクションクリア
    end
end