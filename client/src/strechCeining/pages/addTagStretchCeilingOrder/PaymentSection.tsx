import React from 'react';

const PaymentSection: React.FC<any> = ({ register }: any) => {



  return (
    <div className="profile">
      <div className="inputDiv">
        <label htmlFor="pey">Վճարման միջոց</label>
        <select id="pey" {...register("paymentMethod", { required: true })}>
          <option className="selectCoop" value={"cash"} >Կանխիկ</option>
          <option className="selectCoop" value={"transfer"}>Փոխանցում</option>
          <option className="selectCoop" value={"pos"}>Պոս Տերմինալ</option>
          <option className="selectCoop" value={"credit"}>Ապառիկ</option>
          <option className="selectCoop" value={"inecoPay"}>Ինեկո Փեյ</option>
          <option className="selectCoop" value={"idram"}>Իդրամ</option>
        </select>
      </div>
      <div className="inputDiv">
        <label htmlFor="prepayment">Կանխավճար</label>
        <input id="prepayment" type="number" placeholder="prepayment" {...register('prepayment')} />
      </div>
      <div className="inputDiv">
        <label htmlFor="prepayment">Տեղադրում</label>
        <input type="date" className="form-control" id="date" {...register('installDate')} />
      </div>

    </div>
  );
};

export default PaymentSection;
