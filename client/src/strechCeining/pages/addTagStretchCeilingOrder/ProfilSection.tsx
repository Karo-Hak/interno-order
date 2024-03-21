import React, { ChangeEvent } from 'react';

import './tagStretchOrder.css'
const ProfilSection: React.FC<any> = ({ register,setValue, profilRowId, removeProfilRow, roomId, stretchProfil }: any) => {

  const selectProfilPrice = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>, rowKey: string, roomId: string): void => {
    const selectedId = event.target.value;
    const profil = stretchProfil.find((e: any) => e._id === selectedId);

    if (profil) {
      setValue(`profilPrice_${rowKey}/${roomId}`, profil.price)
    } else {
      setValue(`profilPrice_${rowKey}/${roomId}`, 0)

    }
  };

  return (<>
    {
      profilRowId.length > 0 ?
        <div style={{ marginLeft: "5px", width: "100%" }}>
          <table className="table tableSection" >
            <thead>
              <tr style={{ background: "#dfdce0" }}>
                <th>Պրոֆիլ</th>
                <th>Գին</th>
                <th>Քանակ</th>
                <th>Հեռացնել</th>
              </tr>
            </thead>
            <tbody >
              {
                profilRowId.map((rowKey: any) => {
                  return (
                    <tr key={rowKey}>
                      <td style={{minWidth:"250px", }}>
                        <select
                          {...register(`profilId_${rowKey}/${roomId}`)}
                          onChange={(e) => selectProfilPrice(e, rowKey, roomId)}
                        >
                          <option>Ընտրել Տեսակը</option>
                          {stretchProfil.length > 0 ?
                            stretchProfil.map((e: any) => (
                              <option key={e._id} value={e._id} >
                                {e.name}
                              </option>
                            ))
                            : null}
                        </select>

                      </td>
                      <td>
                        <input
                          type="number"
                          placeholder="Price"
                          {...register(`profilPrice_${rowKey}/${roomId}`)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          placeholder="Quantity"
                          {...register(`profilQuantity_${rowKey}/${roomId}`)}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removeProfilRow(rowKey, roomId)}
                        >
                          Հեռացնել
                        </button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
        : null
    }
  </>
  );
};

export default ProfilSection;
