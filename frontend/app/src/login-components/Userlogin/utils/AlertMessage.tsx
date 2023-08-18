import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { forwardRef } from "react";


// カスタムのアラートメッセージコンポーネントを作成
const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert( // 引数 = refが指すDOM要素の型, Alertコンポーネントが受け取るpropsの型
 // forwardRefを使うことで、親コンポーネント（AlertMessage）が、子コンポーネント(MuiAlert)にアクセスすることが可能に
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
}); // shadowの深さ6, コンポーネントの参照を取得するためのref, 背景が塗りつぶし, Alertコンポーネントに渡されるonCloseやseverity等のすべてのpropsを展開

interface AlertMessageProps { // Props の型定義
  open: boolean; // Snackbar（アラートメッセージ）が表示されるかどうかを制御
  setOpen: Function;  // 上記の open フラグを設定するための関数
  severity: "error" | "success" | "info" | "warning"; // アラートの種類（エラー、成功など）
  message: string; // アラートに表示するメッセージ内容
}

// アラートメッセージ（何かアクションを行なった際の案内用に使い回す）
const AlertMessage = ({ open, setOpen, severity, message }: AlertMessageProps) => {
  const handleCloseAlertMessage = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => { //
    if (reason === "clickaway") return; // クリックすればすぐ消えるclickawayでSnackbarが閉じられた場合何もしない

    setOpen(false); // それ以外はアラート(Snackbar)を閉じる
  };

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={6000} // // 6秒後に自動的に非表示にする
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }} // 表示位置を指定
        onClose={handleCloseAlertMessage}
        >
        {/* アラートが閉じる際 */}
        <Alert onClose={handleCloseAlertMessage} severity={severity}> {/* 外部から渡されたpropsを通して受け取る値*/}
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AlertMessage;
