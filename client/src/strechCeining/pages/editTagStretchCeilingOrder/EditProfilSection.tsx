import React, { ChangeEvent, useEffect } from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';

interface EditStretchProfilsSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  profilRowId: string[];
  removeProfilRow: (rowId: number, roomId: string) => void
  roomId: string;
  stretchProfil: { arrStretchProfil: Array<any> };
  profilId: Array<{ id: string; price: number; quantity: number }>;
}

const EditProfilSection: React.FC<EditStretchProfilsSectionProps> = ({
  register,
  setValue,
  profilRowId,
  removeProfilRow,
  roomId,
  stretchProfil,
  profilId
}: EditStretchProfilsSectionProps) => {

  useEffect(() => {
    profilRowId.forEach((rowId: any, index: number) => {
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

    });
}, [profilId]);


  const selectProfilPrice = (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>, rowKey: string, roomId: string): void => {
    const selectedId = event.target.value;
    const profil = stretchProfil.arrStretchProfil.find((e: any) => e._id === selectedId);

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
                      <td style={{ minWidth: "250px", }}>
                        <select
                          {...register(`profilId_${rowKey}/${roomId}`)}
                          onChange={(e) => selectProfilPrice(e, rowKey, roomId)}
                        >
                          <option>Ընտրել Տեսակը</option>
                          {stretchProfil.arrStretchProfil && stretchProfil.arrStretchProfil.length > 0 ?
                            stretchProfil.arrStretchProfil.map((e: any) => (
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

export default EditProfilSection;
