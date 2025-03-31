export default function Set({ count, reps, weight }) {
    return (
        <div className="flex justify-between w-full text-center">
            <p className="w-1/3">{count}</p>
            <p className="w-1/3">{reps}</p>
            <p className="w-1/3">{weight}</p>
        </div>
    )
}