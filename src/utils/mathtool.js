/**
 * 根据两次位置计算船舶朝向
 */
export const getIconRotation = (oldpos,newpos)=>{
    let dx = newpos[0]-oldpos[0]
    let dy = newpos[1]-oldpos[1]
    let heading =Math.PI/2 - Math.atan2(dy,dx)
    return heading
}