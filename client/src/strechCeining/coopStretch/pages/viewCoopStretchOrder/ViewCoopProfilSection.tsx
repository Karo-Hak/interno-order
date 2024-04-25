import { StretchProfilProps } from "../../features/coopStrechOrder/coopStretchOrderSlice";

const ViewCoopProfilSection: React.FC<any> = ({ profil }) => {





  return (<>

        <table className="table tableSection">
          <thead>
            <tr style={{ background: "#dfdce0" }}>
              <th >Պրոֆիլ</th>
              <th >Գին</th>
              <th >Գ/Մ</th>
              <th >Գումար</th>
            </tr>
          </thead>
          <tbody>
            {
            profil.map((element:StretchProfilProps) => {
                return <tr key={element.id}>
                  <td>{element.name}</td>
                  <td>{element.price}</td>
                  <td>{element.quantity}</td>
                  <td>{element.sum}</td>
                </tr>
           
            })
            }
          </tbody>
        </table>

  </>);
};

export default ViewCoopProfilSection;
