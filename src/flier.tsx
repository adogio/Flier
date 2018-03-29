import * as React from 'react';
import sparidae from 'sparidae';

export interface IPoint {
    x: number;
    y: number;
}

export interface IFlierComponent {
    fill: string;
    points: IPoint[];
    type: string;
}

export interface IFlier {
    aspect: boolean;
    border: boolean;
    components: IFlierComponent[];
    display: string;
    fontSize: number;
    height: number;
    heightUnit: string;
    type: string;
    width: number;
    widthUnit: number;
}

export interface IProps {
    text: string;
    option?: 'long' | 'force' | 'empty' | 'children' | 'normal';
    raw?: boolean;
    border?: boolean;
    width?: number;
    height?: number;
    bottom?: number;
    right?: number;
    fontSize?: number;
    aspect?: boolean;
    unit?: string;
}

export interface IState {
    flier: IFlier;
}

class Flier extends React.Component<IProps, IState> {
    public constructor(props: IProps) {
        super(props);
        this.getSparidae = this.getSparidae.bind(this);
        this.renderComponents = this.renderComponents.bind(this);
        this.mapComponent = this.mapComponent.bind(this);
        this.parsePoints = this.parsePoints.bind(this);
        this.renderContent = this.renderContent.bind(this);
        this.state = {
            flier: this.getSparidae(),
        };
    }

    public render() {
        return (
            <div
                style={{
                    width: `${this.state.flier.width}${this.state.flier.widthUnit}`,
                    height: `${this.state.flier.height}${this.state.flier.heightUnit}`,
                    // overflow: 'hidden',
                    position: 'relative',
                }} >
                {this.renderSVG()}
                {this.renderContent()}
            </div>);
    }

    protected renderSVG() {
        return (<svg
            viewBox="0 0 480 480"
            width={`${this.state.flier.width}${this.state.flier.widthUnit}`}
            height={`${this.state.flier.height}${this.state.flier.heightUnit}`}
        >
            {this.renderComponents(this.state.flier.components)}
        </svg>);
    }

    protected getSparidae(): IFlier {
        const options = {
            popper: 'json',
            long: this.props.option === 'long',
            force: this.props.option === 'force',
            empty: this.props.option === 'empty',
            raw: this.props.raw || null,
            border: this.props.border || null,
            width: this.props.width || null,
            height: this.props.height || null,
            fontSize: this.props.fontSize || null,
            aspect: this.props.aspect || null,
            unit: this.props.unit || null,
        };
        const sep: IFlier = JSON.parse(sparidae(this.props.text, options));
        return sep;
    }

    protected renderComponents(componentList: IFlierComponent[]) {
        return componentList.map(this.mapComponent);
    }

    protected renderContent() {
        if (this.props.option === 'children') {
            return (<div
                style={{
                    position: 'absolute',
                    top: `0`,
                    left: `0`,
                }}
            >
                {this.props.children}
            </div>);
        } else {
            return (<div
                style={{
                    fontSize: `${this.state.flier.fontSize}${this.state.flier.widthUnit}`,
                    position: 'absolute',
                    bottom: `${this.props.bottom || 8}%`,
                    right: `${this.props.right || 5}%`,
                    userSelect: 'none',
                    cursor: 'default',
                    fontWeight: 'bold',
                }}
            >
                {this.state.flier.display}
            </div>);
        }
    }

    protected mapComponent(value: IFlierComponent, index: number) {
        switch (value.type) {
            case 'polygon':
            default:
                return (<polygon
                    key={index}
                    points={this.parsePoints(value.points)}
                    fill={value.fill}
                />);
        }
    }

    protected parsePoints(points: IPoint[]) {
        let re: string = '';
        for (let i of points) {
            re += `${i.x},${i.y} `;
        }
        return re;
    }
}

export default Flier;
