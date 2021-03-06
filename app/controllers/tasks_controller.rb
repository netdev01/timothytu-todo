class TasksController < ApplicationController

  def index
    # render json: Task.all
    render json: Task.order(:id)
    # render json: Task.order("done ASC, id DESC")
  end

  def update
    task = Task.find(params[:id])
    task.update_attributes(task_params)
    render json: task
  end
  
  def create
    task = Task.create(task_params)
    render json: task
  end

  def destroy
    task = Task.find(params[:id])
    if task.valid?
      task.destroy
      render json: Task.order(:id)
    end
  end

  private

  def task_params
    params.require(:task).permit(:done, :title)
  end

end
