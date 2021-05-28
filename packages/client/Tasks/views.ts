import { Model } from "@effect-ts-app/core/ext/Schema"
import { UserTaskView } from "@effect-ts-demo/todo-types"

export class TaskView extends Model<TaskView>("Task")(UserTaskView.Model.Api.props) {}
