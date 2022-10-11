import PropTypes from 'prop-types';
import { BlockPicker } from 'react-color';
import { Square } from '@chakra-ui/react'

import React, { Component } from 'react'


export class ColourPicker extends Component {
    static propTypes = {
      expanded: PropTypes.bool,
      onExpandEvent: PropTypes.func,
      onChange: PropTypes.func,
      currentState: PropTypes.object,
    };
  
    stopPropagation = (event) => {
      event.stopPropagation();
    };
  
    onChange = (color) => {
      const { onChange } = this.props;
      onChange('color', color.hex);
    }
  
    renderModal = () => {
      const { color } = this.props.currentState;
      return (
        <div
          onClick={this.stopPropagation}
        >
          <BlockPicker color={color} onChangeComplete={this.onChange} />
        </div>
      );
    };
  
    render() {
      const { expanded, onExpandEvent } = this.props;
      const { color } = this.props.currentState;
      return (
        <div
          aria-haspopup="true"
          aria-expanded={expanded}
          aria-label="rdw-color-picker"
        >
          <div
            onClick={onExpandEvent}
          >
            <Square size='30px' bg={color}/>
          </div>
          {expanded ? this.renderModal() : undefined}
        </div>
      );
    }
  }

export default ColourPicker
