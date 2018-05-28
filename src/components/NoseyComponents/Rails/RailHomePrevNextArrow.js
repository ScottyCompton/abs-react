import React from 'react';
import { PropTypes } from 'prop-types';
import IconButton from 'material-ui/IconButton';
import FontAwesome from 'react-fontawesome';

export default class RailHomePrevNextArrow extends React.Component {
  static propTypes = {
    whichArrow: PropTypes.string.isRequired,
    onClick: PropTypes.func
  };

  render() {
    const arrClass = "slick-arrow slick-" + this.props.whichArrow + "-arrow";
    const styles = {
      arrIcon: {
        width: 90,
        height: 90,
      },
      arrBtn: {
        width: 100,
        height: 100,
        padding: 0,
        position: 'relative',
        top: '40%',
        transform: 'translateY(-50%)'
      },
    };


    if (this.props.whichArrow === 'left') {
      return (
        <div className="leftArrow home-slick">
        <IconButton onClick={this.props.onClick} className={arrClass} iconStyle={styles.arrIcon} style={styles.arrBtn}>
          <FontAwesome name="angle-double-left" />
        </IconButton>
        </div>
      );
    } else {
      return (
        <div className="rightArrow home-slick">
        <IconButton onClick={this.props.onClick} className={arrClass} iconStyle={styles.arrIcon} style={styles.arrBtn}>
          <FontAwesome name="angle-double-right" />
        </IconButton>
      </div>
      );
    }
  }
}
