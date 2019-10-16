export const registerToCourse = (course, userId) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {

        const firestore = getFirestore();

        firestore.collection('user').doc(userId).update({
            registeredCourse: course
        }).then(() => {
            alert('報名成功');
            document.location.href = '/';
            dispatch({type: 'REGISTERED_TO_COURSE', course});
        })
    }
}