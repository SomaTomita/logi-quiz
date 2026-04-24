FactoryBot.define do
    factory :section do
        sequence(:section_name) { |n| "セクション#{n}" }
        locale { "ja" }
    end
end