import Slider, { createSliderWithTooltip } from "rc-slider";
import "rc-slider/assets/index.css";
import styled from "styled-components";
const Range = createSliderWithTooltip(Slider.Range);
const StyledSlider = styled(Range)`
  margin-bottom: 5px;
  .rc-slider-handle {
    border: none;
    background-color: ${(props) => props.theme.secondary};
  }

  .rc-slider-rail {
    background-color: ${(props) => props.theme.lightenedDark};
  }

  .rc-slider-track {
    background-color: ${(props) => props.theme.light};
  }

  .rc-slider-handle-dragging.rc-slider-handle-dragging.rc-slider-handle-dragging {
    border: none;
    box-shadow: 0 0 0 2px ${(props) => props.theme.secondary};
  }
  .rc-slider-step {
    display: none;
  }
`;

export { StyledSlider as Slider };
