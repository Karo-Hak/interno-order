import React, { ChangeEvent, useEffect } from 'react';
import { UseFormGetValues, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { Data } from '../addTagStretchCeilingOrder/TagStretchOrder';

interface EditStretchProfilsSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  profilRowId: string[];
  removeProfilRow: (rowId: string, roomId: string) => void;
  roomId: string;
  stretchProfil: Array<Data>;
  profilId: Array<Data>;
}

const EditProfilSection: React.FC<EditStretchProfilsSectionProps> = ({
  register,
  setValue,
  getValues,
  profilRowId,
  removeProfilRow,
  roomId,
  stretchProfil,
  profilId
}: EditStretchProfilsSectionProps) => {

  useEffect(() => {
    profilRowId.forEach((rowId: string, index: number) => {
      setValue(`profilId_${rowId}/${roomId}`, profilId[index].id);
      if (profilId[index].price) {
        setValue(`profilPrice_${rowId}/${roomId}`, profilId[index].price);
      } else {
        setValue(`profilPrice_${rowId}/${roomId}`, 0);
      }
      if (profilId[index].quantity) {
        setValue(`profilQuantity_${rowId}/${roomId}`, profilId[index].quantity);
      } else {
        setValue(`profilQuantity_${rowId}/${roomId}`, 0);
      }
      if (profilId[index].sum) {
        setValue(`profilSum_${rowId}/${roomId}`, profilId[index].sum);
      } else {
        setValue(`profilSum_${rowId}/${roomId}`, profilId[index].price * profilId[index].quantity);
      }

    });
  }, [profilId]);


  const selectProfilPrice = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>, rowKey: string, roomId: string): void => {
    const selectedId = event.target.value;
    const profil = stretchProfil.find((e: Data) => e._id === selectedId);

    if (profil) {
      setValue(`profilPrice_${rowKey}/${roomId}`, profil.price)
      setValue(`profilQuantity_${rowKey}/${roomId}`, "")
      profilSum(rowKey, profil.price, 0)
    } else {
      setValue(`profilPrice_${rowKey}/${roomId}`, 0)

    }
  };

  const profilSum = (rowId: string, price: number, quantity: number): void => {

    const totalPrice = price * quantity;
    if (totalPrice) {
      setValue(`profilSum_${rowId}/${roomId}`,  Math.ceil(totalPrice));
    } else {
      setValue(`profilSum_${rowId}/${roomId}`, 0);
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
                <th >Գումար</th>
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
                          {...register(`profilId_${rowKey}/${roomId}`)}
                          onChange={(e) => selectProfilPrice(e, rowKey, roomId)}
                        >
                          <option>Ընտրել Տեսակը</option>
                          {stretchProfil && stretchProfil.length > 0 ?
                            stretchProfil.map((e: Data) => (
                              <option key={e._id} value={e._id} >
                                {e.name}
                              </option>
                            ))
                            : null}
                        </select>

                      </td>
                      <td>
                        <input
                          id={`profilPrice_${rowKey}/${roomId}`}
                          placeholder="Price"
                          {...register(`profilPrice_${rowKey}/${roomId}`)}
                          onChange={(e) => profilSum(rowKey, parseFloat(e.target.value), parseFloat(getValues(`profilQuantity_${rowKey}/${roomId}`)))}

                        />
                      </td>
                      <td>
                        <input
                          id={`profilQuantity_${rowKey}/${roomId}`}
                          placeholder="Quantity"
                          {...register(`profilQuantity_${rowKey}/${roomId}`)}
                          onChange={(e) => profilSum(rowKey, parseFloat(getValues(`profilPrice_${rowKey}/${roomId}`)), parseFloat(e.target.value),)}

                        />
                      </td>
                      <td>
                        <input
                          id={`profilSum_${rowKey}/${roomId}`}
                          placeholder="Sum"
                          {...register(`profilSum_${rowKey}/${roomId}`)}
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

export default EditProfilSection;
