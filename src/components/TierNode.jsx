import PropTypes from 'prop-types';

const TierNode = ({ data }) => {
  return (
    <div
      style={{
        width: '75px',
        height: '350px',
        background: '#5d5d5d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid #ccc',
        fontWeight: 'bold',
        color: 'white',
      }}
    >
      <span style={{ rotate: '-90deg' }}>{data.label}</span>
    </div>
  );
};

TierNode.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string,
  }).isRequired,
};

export default TierNode;
