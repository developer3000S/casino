import React, {useEffect, useState} from 'react'
import PokerDashboard from './pokerDashboard'

function Poker(props){ 
    const {page} = props
    let table_type = page.game.table_type //texas holdem or 5 card draw
    let [template, seTemplate] = useState(null)

    useEffect(() => {       
        handleChoosePokerType()
        return () => {
            seTemplate(null)
        }
    }, [])

    function handleChoosePokerType(){
        switch(table_type) {
            case "poker_5_card_draw":
                seTemplate("poker_5_card_draw")
                break
            case "poker_texas_holdem":
            default: 
                seTemplate("poker_texas_holdem")
        }
    }

    return <>
        {template ? <PokerDashboard {...props} template={template} /> : null}
    </>
}

export default Poker