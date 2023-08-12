import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "App";

const Success: React.FC = () => {
  const { isSignedIn, currentUser } = useContext(AuthContext);  // AuthContextからisSignedInとcurrentUserの情報を取得
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn && currentUser) { // サインインしていて、currentUserが存在する場合2.5秒でセクション画面に遷移
      setTimeout(() => {
        navigate("/sections");
      }, 2500);
    }
  }, [isSignedIn]); // ユーザーのログインを判別するステートが更新された際に遷移

  return (
    <>
      {
        isSignedIn && currentUser ? (
          <>
            <h1>Signed in successfully!</h1>
            <h2>Email: {currentUser?.email}</h2>
            <h2>Name: {currentUser?.name}</h2>
            <h4>まもなくホーム画面に移動します</h4>
          </>
        ) : (
          <h1>Not signed in</h1>
        )
      }
    </>
  );
}

export default Success;
