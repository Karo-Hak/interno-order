import { LightRingProps } from "../../features/coopStrechOrder/coopStretchOrderSlice";

const ViewCoopLightRingSection: React.FC<any> = ({lightRing}) => {

  return (<>
    < table className="table tableSection">
      <thead>
        <tr style={{ background: "#dfdce0" }}>
          <th >Լ. Օղակ</th>
          <th >Գին</th>
          <th >Հատ</th>
          <th >Գումար</th>
        </tr>
      </thead>
      <tbody>
        {
          lightRing.map((element: LightRingProps) => {

            return <tr key={element.id}>
              <td>{element.name}</td>
              <td>{element.price}</td>
              <td>{element.quantity}</td>
              <td>{element.sum}</td>
            </tr>

          })
        }
      </tbody>
    </table >

  </>);
};

export default ViewCoopLightRingSection;
