import React from 'react';
import { PropTypes } from 'prop-types';
import IconButton from 'material-ui/IconButton';
import FontAwesome from 'react-fontawesome';

export default class RailPrevNextArrow extends React.Component {
  static propTypes = {
    whichArrow: PropTypes.string.isRequired,
    onClick: PropTypes.func
  };

  render() {
    const arrClass = "slick-arrow slick-" + this.props.whichArrow + "-arrow";
    const styles = {
      arrIcon: {
        width: 40,
        height: 40,
        fontSize: 48
      },
      arrBtn: {
        width: 40,
        height: 40,
        padding: 0,
        position: 'absolute',
        transform: 'translate(0,50%)',
        top: '25%'
      },
    };


    if (this.props.whichArrow === 'left') {
      return (
        <IconButton onClick={this.props.onClick} className={arrClass} iconStyle={styles.arrIcon} style={styles.arrBtn}>
          <FontAwesome name="angle-double-left" />
        </IconButton>
      );
    } else {
      return (
        <IconButton onClick={this.props.onClick} className={arrClass} iconStyle={styles.arrIcon} style={styles.arrBtn}>
          <FontAwesome name="angle-double-right" />
        </IconButton>
      );
    }
  }
}
