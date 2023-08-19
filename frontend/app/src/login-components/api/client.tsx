import applyCaseMiddleware from "axios-case-converter"
import axios from "axios"

// applyCaseMiddleware:
// axiosで受け取ったレスポンスの値をスネークケース→キャメルケースに変換
// または送信するリクエストの値をキャメルケース→スネークケースに変換してくれるライブラリ

// HTTPヘッダーはケバブケースを維持する必要があるため適用を無視するオプションを追加
const options = {
    ignoreHeaders: true
}

const client = applyCaseMiddleware(
    axios.create({
        baseURL: 'http://localhost:3001', // // axiosのインスタンスを作成
    }),
    options // 第二引数として渡すことで、HTTPヘッダーのキーをそのままの形で保持する動作がaxiosのインスタンスに適用
);

export default client;