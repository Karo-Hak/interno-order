import { useNavigate } from "react-router-dom"
import React from "react";

interface CoopStretchMenuProps {}

export const CoopStretchMenu: React.FC<CoopStretchMenuProps> = (): JSX.Element => {
  const navigate = useNavigate();

  const openNewWindow =
    (url: string) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      window.open(url, "_blank");
    };

  const tagStretchBuyer = () => navigate("/coopStretchceiling/AddCoopStretchBuyer");
  const newTagStretchOrder = () => navigate("/coopStretchceiling/addCoopStretchOrder");
  const home = () => navigate("/coopStretchceiling/report");
  const viewStretchOrders = () => navigate("/coopStretchceiling/viewCoopOrderList");
  const viewDebetKredit = () => navigate("/coopstretchceiling/coopBuyerWallet");

  const newReturnDoc = () => navigate("/coopStretchceiling/addCoopReturn");
  const newReturnList = () => navigate("/coopStretchceiling/viewCoopReturnList");

  return (
    <div className="admin_profile">
      <div style={{ textAlign: "left", width: "10%" }}>
        <button className="btn" onClick={home}>
          Գլխավոր Էջ
        </button>
      </div>

      <div className="admin_profile">
        <button
          className="btn"
          onClick={newTagStretchOrder}
          onContextMenu={openNewWindow("/coopStretchceiling/addCoopStretchOrder")}
        >
          Նոր Պատվեր
        </button>

        <button
          className="btn"
          onClick={tagStretchBuyer}
          onContextMenu={openNewWindow("/coopStretchceiling/AddCoopStretchBuyer")}
        >
          Ավելացնել Գնորդ
        </button>

        <button
          className="btn"
          onClick={viewStretchOrders}
          onContextMenu={openNewWindow("/coopStretchceiling/viewCoopOrderList")}
        >
          Դիտել Պատվերները
        </button>

        <button
          className="btn"
          onClick={viewDebetKredit}
          onContextMenu={openNewWindow("/coopstretchceiling/coopBuyerWallet")}
        >
          Դեբետ/Կրեդիտ
        </button>

        <button
          className="btn"
          onClick={newReturnDoc}
          onContextMenu={openNewWindow("/coopStretchceiling/addCoopReturn")}
        >
          Նոր Վերադարձ
        </button>
        <button
          className="btn"
          onClick={newReturnList}
          onContextMenu={openNewWindow("/coopStretchceiling/viewCoopReturnList")}
        >
          Դիտել Վերադարձ
        </button>
      </div>

      <div style={{ width: "10%" }} />
    </div>
  );
};
