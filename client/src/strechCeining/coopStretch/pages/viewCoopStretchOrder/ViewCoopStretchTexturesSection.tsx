
import { StretchTextureProps } from '../../features/coopStrechOrder/coopStretchOrderSlice';
import './viewCoopStretchOrder.css'


const ViewStretchTexturesSection: React.FC<any> = ({ stretch }) => {

    return (<>
        <table className="table tableSection">
            <thead>
                <tr style={{
                    background: "#dfdce0"
                }}>
                    <th>Առաստաղ</th>
                    <th>Գին</th>
                    <th>Երկարություն</th>
                    <th>Լայնություն</th>
                    <th>Ք.Մ</th>
                    <th>Գումար</th>
                </tr>
            </thead>
            <tbody>
                {
                    stretch.map((element: StretchTextureProps) => {
                        return <tr key={element.id}>
                            <td>{element.name}</td>
                            <td>{element.price}</td>
                            <td>{element.width}</td>
                            <td>{element.height}</td>
                            <td>{element.quantity}</td>
                            <td>{element.sum}</td>
                        </tr>
                    })
                }

            </tbody>
        </table>
    </>);
};

export default ViewStretchTexturesSection;
