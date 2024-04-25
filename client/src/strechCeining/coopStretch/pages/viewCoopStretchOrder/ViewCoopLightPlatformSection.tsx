import { LightPlatformProps } from "../../features/coopStrechOrder/coopStretchOrderSlice";

const ViewCoopLightPlatformSection: React.FC<any> = ( {lightPlatform} ) => {

  return (<>

    < table className="table tableSection">
      <thead>
        <tr style={{ background: "#dfdce0" }}>
          <th >Լ. Պլատֆորմ</th>
          <th >Գին</th>
          <th >Հատ</th>
          <th >Գումար</th>
        </tr>
      </thead>
      <tbody>
        {
          lightPlatform.map((element: LightPlatformProps) => {

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

export default ViewCoopLightPlatformSection;
