import React, { Component } from "react";
import { withRouter } from 'react-router-dom';

// components
import ClassSingle from "./reschedule_preview_classSingle";
import NextStepButtonsArea from '../ui/nextStepButtonArea';

class ClassList extends Component {

    handleClick = () => {
        this.props.submit();
    }

    render() {
        return (
            <div className='nextStepButtonsArea_parent'>
                {this.props.classes.map((classSingle, i) => {
                    return (
                        <ClassSingle
                            classSingle={classSingle}
                            key={i}
                            select={this.props.select}
                        />
                    );
                })}
                <NextStepButtonsArea action={this.handleClick} cancel={this.props.clearTimeTable}/>
            </div>
        );
    }
}

export default withRouter(ClassList);
