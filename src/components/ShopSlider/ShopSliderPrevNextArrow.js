import React from 'react';
import { PropTypes } from 'prop-types';
import IconButton from 'material-ui/IconButton';
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import ChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';

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
        height: 80,
        border: 0,
      },
      arrBtn: {
        width: 30,
        height: 70,
        padding: 0,
        position: 'absolute',
        border: 0,
      },
    };


    if (this.props.whichArrow === 'left') {
      return (
        <IconButton onClick={this.props.onClick} className={arrClass} iconStyle={styles.arrIcon} style={styles.arrBtn}>
          <ChevronLeft color={'#202020'} hoverColor={'#c0c0c0'}/>
        </IconButton>
      );
    } else {
      return (
        <IconButton onClick={this.props.onClick} className={arrClass} iconStyle={styles.arrIcon} style={styles.arrBtn}>
          <ChevronRight color={'#202020'} hoverColor={'#c0c0c0'}/>
        </IconButton>
      );
    }
  }
}
