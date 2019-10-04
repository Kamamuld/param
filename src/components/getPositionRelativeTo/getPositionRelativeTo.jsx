export default ({ triggerRef, renderRef, portalRelativeParentId, isInner, isUp, isRight, offsetTop, offsetLeft }) => {
    if (!renderRef.current || !triggerRef.current) return {};
    const style = {};
    const layoutParams = renderRef.current.getBoundingClientRect();
    const triggerParams = triggerRef.current.getBoundingClientRect();
    style.left = isRight
        ? triggerParams.left + triggerParams.width - layoutParams.width
        : triggerParams.left;
    style.top = isUp
        ? triggerParams.top - layoutParams.height - 2
        : isInner
            ? triggerParams.top
            : triggerParams.top + triggerParams.height + 2;
    style.bottom = 'auto';
    if (portalRelativeParentId) {
        const relativeParent = document.getElementById(portalRelativeParentId);
        if (relativeParent) {
            const relParentParams = relativeParent.getBoundingClientRect();
            style.left -= relParentParams.left;
            style.top -= relParentParams.top;
        }
    }
    if (offsetTop) style.top += offsetTop;
    if (offsetLeft) style.left += offsetLeft;
    return style;
};