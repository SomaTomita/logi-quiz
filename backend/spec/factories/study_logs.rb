FactoryBot.define do
    factory :study_log do
      user
      date { Faker::Date.backward }
      study_time { rand(1..20) } # 1から20回セクションクリア数
    end
end