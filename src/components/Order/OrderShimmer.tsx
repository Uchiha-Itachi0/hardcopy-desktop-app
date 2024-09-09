export default function OrderShimmer({ total }: { total: number }) {
    const shimmerLines = Array.from({ length: total }, (_, index) => (
        <div key={index} className={`bg-shimmer-dark relative flex flex-col  gap-6 rounded-2xl w-[40vw] p-4`}>
            <div className={`bg-shimmer-light w-32 h-7 rounded-md`}></div>
            <div className={`flex flex-col gap-6`}>
                <div className={`flex gap-8 items-center`}>
                    <div className={`bg-shimmer-light w-28 h-5 rounded-md`}></div>
                    <div className={`bg-shimmer-light w-28 h-7 rounded-md`}></div>
                </div>
                <div className={`flex gap-8 items-center`}>
                    <div className={`bg-shimmer-light w-28 h-5 rounded-md`}></div>
                    <div className={`bg-shimmer-light w-28 h-7 rounded-md`}></div>
                </div>
                <div className={`flex gap-8 items-center`}>
                    <div className={`bg-shimmer-light w-28 h-5 rounded-md`}></div>
                    <div className={`bg-shimmer-light w-28 h-7 rounded-md`}></div>
                </div>
            </div>
            <div className={`absolute top-4 right-8 bg-shimmer-light w-44 h-5`}></div>
        </div>
    ));

    return <>{shimmerLines}</>;
}
