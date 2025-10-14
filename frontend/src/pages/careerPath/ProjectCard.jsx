import { useState } from "react";
import { FaArrowCircleDown, FaArrowCircleUp } from "react-icons/fa";

const ProjectCard = ({ project, onStatusChange, onDeleteChange, section }) => {

    const [showDescription, setShowDescription] = useState(false);

    return (
        <div className="bg-white dark:bg-dark-background p-8 rounded-xl shadow-md border border-green-300 mt-5">

            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-dark-text">{project.project_name}</h3>
                    <p className="text-sm text-gray-500 mb-4">Perfect for: <span className="font-medium text-indigo-400">{project.sector}</span></p>
                </div>
                <button
                    onClick={() => setShowDescription(!showDescription)}
                    className="bg-green-100 text-green-800 text-xl font-semibold px-3 py-1 rounded-full cursor-pointer">

                    <span>{showDescription ? <FaArrowCircleUp /> : <FaArrowCircleDown />}</span>

                </button>
            </div>


            <p className="text-gray-600 dark:text-dark-text/50 mb-6">{project.short_description}</p>

            <div
                className={`transition-all duration-500 overflow-hidden ${showDescription ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"
                    }`}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mb-6">
                    <div className="flex gap-2 flex-wrap mb-4">
                        {project.requirements.map((tech, i) => (
                            <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{tech}</span>
                        ))}
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-500 mb-2">Duration</h4>
                        <p className="text-gray-800 dark:text-dark-text/50 font-medium">{project.duration}</p>
                    </div>

                    <div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 mb-2">Complexity</h4>
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <span
                                        key={i}
                                        className={`material-icons text-base ${i < Number(project.complexity)
                                            ? "text-yellow-500"
                                            : "text-gray-300"
                                            }`}
                                    >
                                        {i < Number(project.complexity) ? "star" : "star_border"}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                    <h4 className="font-semibold text-gray-800 mb-2">Why This Project?</h4>
                    <p className="text-sm text-gray-600">{project.why_this_project}</p>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-dark-text/50">

                    {project.tags.map((tag, i) => (
                        <div className="flex items-center space-x-1">
                            <span key={i} className="material-icons text-green-500 text-base">check_circle</span>
                            <span>{tag}</span>
                        </div>
                    ))}
                </div>

                <div className='space-x-5'>
                    <div className="flex gap-4 mt-4">
                        {section !== "in_progress" && (
                            <button
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg"
                                onClick={() => onStatusChange(project.id, "in_progress")}
                            >
                                Start Project
                            </button>
                        )}
                        {section !== "not_started" && (
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                                onClick={() => onStatusChange(project.id, "not_started")}
                            >
                                Mark as Not Started
                            </button>
                        )}
                        {section !== "completed" && (
                            <button
                                className="bg-primary text-light-text hover:bg-primary/90 px-4 py-2 rounded-lg"
                                onClick={() => onStatusChange(project.id, "completed")}
                            >
                                Mark as Completed
                            </button>
                        )}
                        <button
                            className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg"
                            onClick={() => onDeleteChange(project.id)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};


export default ProjectCard;