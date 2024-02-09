import { useNavigate } from "react-router-dom";

const BlockTemp = (props: any) => {
  const { course_id, course_name, block_id, index, block_name, blockSize } = props;
  const navigate = useNavigate();
  const handleBlockClick = () => {
    navigate(`/courses/lectures`, {
      state: {
        course_id: course_id,
        course_name: course_name,
        block_id: block_id,
        block_name: block_name,
        block_index: index,
      },
    });
  };

  return (
    <div
      className="row-border mt-2 rounded hover-effect p-3 text-start"
      onClick={handleBlockClick}
      style={{ cursor: "pointer"}}
    >
      <h5>Block {index}</h5>
      <h5>{block_name}</h5>
    </div>
  );
};

export default BlockTemp;
