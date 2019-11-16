const initState = {
    loading: false
}

const pageReducer = (state = initState, action) => {
    switch (action.type) {
        case 'LOADING': 
            return {
                ...state,
                loading: true
            }
        case 'LOADED':
            return {
                ...state,
                loading: false
            }
        default:
            return state
    }
}

export default pageReducer