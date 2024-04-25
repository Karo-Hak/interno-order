import React, { ChangeEvent } from 'react';
import { UseFormRegister, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import './tagStretchOrder.css'
import { StretchProfilProps } from '../../../features/strechProfil/strechProfilSlice';

interface CoopProfilSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  profilRowId: Array<string>;
  removeProfilRow: (rowId: string) => void;
  stretchProfil: Array<StretchProfilProps>;
}

const CoopProfilSection: React.FC<CoopProfilSectionProps> = ({
  register,
  setValue,
  getValues,
  profilRowId,
  removeProfilRow,
  stretchProfil
}: CoopProfilSectionProps) => {

  const selectProfilPrice = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>, rowKey: string): void => {
    const selectedId = event.target.value;
    const profil = stretchProfil.find((e: StretchProfilProps) => e._id === selectedId);

    if (profil) {
      setValue(`profilPrice_${rowKey}`, profil.coopPrice)
      setValue(`profilQuantity_${rowKey}`, "")
      profilSum(rowKey, profil.price, 0)
    } else {
      setValue(`profilPrice_${rowKey}`, 0)

    }
  };

  const profilSum = (rowId: string, price: number, quantity: number): void => {

    const totalPrice = price * quantity;
    if (totalPrice) {
      setValue(`profilSum_${rowId}`, totalPrice);
    } else {
      setValue(`profilSum_${rowId}`, 0);
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
                <th>Գումար</th>
                <th>Հեռացնել</th>
              </tr>
            </thead>
            <tbody >
              {
                profilRowId.map((rowKey: string) => {
                  return (
                    <tr key={rowKey}>
                      <td style={{ minWidth: "250px", }}>
                        <select
                          {...register(`profilId_${rowKey}`)}
                          onChange={(e) => selectProfilPrice(e, rowKey)}
                        >
                          <option>Ընտրել Տեսակը</option>
                          {stretchProfil.length > 0 ?
                            stretchProfil.map((e: StretchProfilProps) => (
                              <option key={e._id} value={e._id} >
                                {e.name}
                              </option>
                            ))
                            : null}
                        </select>

                      </td>
                      <td>
                        <input
                          id={`profilPrice_${rowKey}`}
                          placeholder="Price"
                          {...register(`profilPrice_${rowKey}`)}
                          onChange={(e) => profilSum(rowKey, parseFloat(e.target.value), parseFloat(getValues(`profilQuantity_${rowKey}`)))}

                        />
                      </td>
                      <td>
                        <input
                          id={`profilQuantity_${rowKey}`}
                          placeholder="Quantity"
                          {...register(`profilQuantity_${rowKey}`)}
                          onChange={(e) => profilSum(rowKey, parseFloat(getValues(`profilPrice_${rowKey}`)), parseFloat(e.target.value),)}

                        />
                      </td>
                      <td>
                        <input
                          id={`profilSum_${rowKey}`}
                          placeholder="Sum"
                          {...register(`profilSum_${rowKey}`)}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removeProfilRow(rowKey)}
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

export default CoopProfilSection;
