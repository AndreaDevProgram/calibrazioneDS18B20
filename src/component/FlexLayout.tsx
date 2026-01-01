interface FlexLayoutProps{
    flexDirection?: string;
    flexWrap?: string;
    justifyContent?: string;
    alignItems?: string;
    gap?: string;
    width?: string;
    height?: string;
    borderRadius?: string;
    borderColor?: string;
    boxShadow?: string;
    borderStyle?: string;
    borderWidth?: string;
    margin?: string;
    children: React.ReactNode; 
}


function FlexLayout(props: FlexLayoutProps){

    let {children, ...style} = props;
    
    const stileFinale = { display: 'flex', boxSizing: 'border-box', overflow: 'hidden', maxWidth: '100%', ...style };
    
    return (<>
            <div style={stileFinale as React.CSSProperties} className="pc-div tablet-div mobile-div">
                {children}
            </div>
        </>);
}

export {FlexLayout};