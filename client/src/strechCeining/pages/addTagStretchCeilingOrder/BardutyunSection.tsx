import React, { ChangeEvent } from 'react';

import './tagStretchOrder.css';


const BardutyunSection: React.FC<any> = ({ register, setValue, bardutyunRowId, removeBardutyunRow, roomId, stretchBardutyun }: any) => {


  const stretchBardutyunPrice = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>, rowKey: string, roomId: string): void => {
    const selectedId = event.target.value;
    const bardutyun = stretchBardutyun.find((e: any) => e._id === selectedId);
    if (bardutyun) {
      setValue(`bardutyunPrice_${rowKey}/${roomId}`, bardutyun.price);
    } else {
      setValue(`bardutyunPrice_${rowKey}/${roomId}`, 0);
    }
  };

  return (
    <div style={{ marginLeft: "5px", width: "100%" }} >
      {
        bardutyunRowId && bardutyunRowId.length > 0 ?

          <table className="table tableSection" >
            <thead>
              <tr style={{ background: "#dfdce0" }}>
                <th>Բարդություն</th>
                <th>Գին</th>
                <th>Քանակ</th>
                <th>Հեռացնել</th>
              </tr>
            </thead>
            <tbody>
              {bardutyunRowId.map((el: any) => (
                <tr key={el}>
                  <td style={{ minWidth: "250px", }}>
                    <select
                      {...register(`bardutyunId_${el}/${roomId}`)}
                      onChange={(e) => stretchBardutyunPrice(e, el, roomId)}
                    >
                      <option>Ընտրել Տեսակը</option>
                      {stretchBardutyun.length > 0 ?
                        stretchBardutyun.map((bardutyun: any) => (
                          <option key={bardutyun._id} value={bardutyun._id}>{bardutyun.name}</option>
                        ))
                        : null}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      placeholder="Price"
                      {...register(`bardutyunPrice_${el}/${roomId}`)}
                    />
                  </td>
                  <td>
                    <input
                      placeholder="Quantity"
                      {...register(`bardutyunQuantity_${el}/${roomId}`)}
                    />
                  </td>
                  <td>
                    <button type="button" onClick={() => removeBardutyunRow(el, roomId)}>
                      Հեռացնել
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          : null
      }
    </div>
  );
};

export default BardutyunSection;
