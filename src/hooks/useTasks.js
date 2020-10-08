import Axios from "axios";
import { useState, useContext } from "react";
import { API_ENDPOINT } from "../constants";
import { AuthContext } from "./useAuth";

export const useTasks = () => {

    const auth = useContext(AuthContext);
    const [ taskList, setTaskList ] = useState([]);
    const [ error, setError ] = useState(null);
    const [ processing, setProcessing ] = useState(false);
    const [ taskRemoved, setTaskRemoved ] = useState(null);

    const list = async () => {
        try {
            setProcessing(true);
            setError(null);
            const response = await Axios.get(`${API_ENDPOINT}/tasks?sort=whenToDo,asc`, buildAuthHeader())
            setTaskList(response.data.content);
            setProcessing(false);  
        } catch (error) {
            handleError(error);
        }
    }

    const remove = async (taskToRemove) => {
        try {
            await Axios.delete(`${API_ENDPOINT}/tasks/${taskToRemove.id}`, buildAuthHeader());
            setTaskList(taskList.filter(task => taskToRemove.id !== task.id));
            setTaskRemoved(taskToRemove);

        } catch (error) {
            handleError(error);
        }
        
    }

    const clearTaskRemoved = () => {
        setTaskRemoved(null);
    }

    const buildAuthHeader = () => {
        return {
            headers: {
                'Authorization': `Bearer ${auth.credentials.token}`
            }
        }
    }

    const handleError = (error) => {
        console.log(error);
        const resp = error.response;

        if (resp && resp.status === 400 && resp.data) {
            setError(resp.data.error);
        } else {
            setError(error.message);
        }

        setProcessing(false);
    }

    return { taskList, error, processing, taskRemoved, list, remove, clearTaskRemoved };
}