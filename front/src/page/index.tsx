import React from 'react';
import { connectModel } from '../util';
import './index.scss';

@connectModel(
    (state: any) => ({
        indexData: state.index
    }),
    (dispatch: any) => ({

    })
)
export default class App extends React.Component<any, any>{
    public render() {
        return (
            <div className="container">
                <div className="left-panel">
                    left
                </div>
                <div className="right-panel">
                    right
                </div>
            </div>
        );
    }
}