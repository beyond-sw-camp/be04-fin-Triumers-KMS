import { createRouter, createWebHistory } from 'vue-router';

import SearchView from '@/views/SearchView.vue';
import SearchAllListView from '@/components/post/SearchAllPostList.vue';

import WorkspaceView from '@/views/WorkspaceView.vue';
import PostListView from "@/components/post/SelectedPostList.vue";
import PostDetailView from "@/components/post/SelectedPostDetail.vue";
import PostWriterView from "@/components/post/CreateNewPost.vue";
import GeneralWriterView from "@/components/post/CreateNewGeneralPost.vue";
import DocsWriterView from "@/components/post/CreateNewDocs.vue";
import DocsListView from "@/components/post/SelectedDocsList.vue";

import AnonymousBoard from '@/views/AnonymousBoard.vue';
import AnonymousBoardListView from '@/components/anonymous-board/AnonymousBoardList.vue';
import AnonymousBoardDetailView from '@/components/anonymous-board/AnonymousBoardDetail.vue';
import AnonymousBoardWriterView from '@/components/anonymous-board/CreateNewAnonymousBoard.vue';

import ApprovalView from '@/views/Approval.vue';
import CreateApprovalView from '@/components/approval/CreateApproval.vue';
import RequestedApprovalView from '@/components/approval/RequestedApprovals.vue';
import RequestedApprovalDetailView from '@/components/approval/RequestedApprovalDetail.vue';
import ReceivedApprovalView from '@/components/approval/ReceivedApprovals.vue';
import ReceivedApprovalDetailView from '@/components/approval/ReceivedApprovalDetail.vue';

import CreateQuiz from '@/components/quiz/CreateQuiz.vue';
import TakeQuiz from '@/components/quiz/TakeQuiz.vue';
import QuizView from '@/views/QuizView.vue';

import Wiki from '@/views/Wiki.vue';
import Workspace from '@/views/Workspace.vue';
import Group from '@/views/Group.vue';
import Study from '@/views/Study.vue';
import Organization from '@/views/Organization.vue';
import OfficeLife from '@/views/OfficeLife.vue';

import Login from '@/components/user/Login.vue';
import MyPage from '@/components/user/MyPage.vue';
import EditMyInfo from '@/components/user/EditMyInfo.vue';
import ChangePassword from '@/components/user/ChangePassword.vue';
import LikedPosts from '@/components/user/LikedPosts.vue';
import FavoritePosts from '@/components/user/FavoritePosts.vue';
import MyComments from '@/components/user/MyComments.vue';
import MyPosts from '@/components/user/MyPosts.vue';

import Manager from '@/views/Manager.vue';
import CreateUser from '@/components/manager/CreateUser.vue';
import EditUser from '@/components/manager/EditUser.vue';
import EditUserRole from '@/components/manager/EditUserRole.vue';
import ResetUserPassword from '@/components/manager/ResetUserPassword.vue';
import SearchUser from '@/components/manager/SearchUser.vue';
import ManagePosition from '@/components/manager/ManagePosition.vue';
import ManageRank from '@/components/manager/ManageRank.vue';

import SearchEmployee from '@/components/employee/SearchEmployee.vue';

import WelcomePage from '@/components/user/Welcome.vue';
import WelcomeToJoin from '@/components/user/WelcomeToJoin.vue';

import OtpRegistration from '@/components/user/OtpRegistration.vue';

import HealthCheck from '@/components/common/HealthCheck.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/health-check',
            component: HealthCheck
        },
        {
            path: '',
            component: Login,
            redirect: '/login'
        },
        {
            path: '/search-employee',
            component: SearchEmployee,
        },
        {
            path: '/my-page',
            component: MyPage
        },
        {
            path: '/my-page/edit',
            component: EditMyInfo
        },
        {
            path: '/my-page/edit-password',
            component: ChangePassword
        },
        {
            path: '/my-page/liked-posts',
            component: LikedPosts
        },
        {
            path: '/my-page/favorite-posts',
            component: FavoritePosts
        },
        {
            path: '/my-page/posts',
            component: MyPosts
        },
        {
            path: '/my-page/comments',
            component: MyComments
        },
        {
            path: '/welcome',
            name: 'WelcomePage',
            component: WelcomePage,
        },
        {
            path: '/welcome-to-join',
            name: 'WelcomeToJoin',
            component: WelcomeToJoin,
        },
        {
            path: '/manager',
            component: Manager,
            children: [
                {
                    path: '',
                    component: SearchUser,
                },
                {
                    path: 'create',
                    name: 'CreateUser',
                    component: CreateUser,
                },
                {
                    path: 'edit/:id',
                    name: 'EditUser',
                    component: EditUser,
                },
                {
                    path: 'edit-user-role/:id',
                    name: 'EditUserRole',
                    component: EditUserRole,
                },
                {
                    path: 'reset-password/:id',
                    name: 'ResetUserPassword',
                    component: ResetUserPassword,
                },
                {
                    path: 'manage-position',
                    name: 'ManagePosition',
                    component: ManagePosition,
                },
                {
                    path: 'manage-rank',
                    name: 'ManageRank',
                    component: ManageRank,
                }
            ],
        },
        {
            path: '/search',
            component: SearchView,
            children: [
                {
                    path: '',
                    component: SearchAllListView,
                },
                {
                    path: 'detail/:id',
                    component: PostDetailView
                },
                {
                    path: ':id/new',
                    component: PostWriterView
                }
            ]
        },
        {
            path: '/wiki',
            component: Wiki,
            children: [
                {
                    path: ':id',
                    component: PostListView,
                },
                {
                    path: 'detail/:id',
                    component: PostDetailView
                },
                {
                    path: ':id/new',
                    component: PostWriterView
                },
                {
                    path: 'quiz',
                    component: QuizView,
                    children: [
                        {
                            path: 'new',
                            component: CreateQuiz
                        },
                        {
                            path: ':id',
                            component: TakeQuiz
                        }
                    ]
                }
            ]
        },
        {
            path: '/workspace',
            component: Workspace,
            children: [
                {
                    path: ':id',
                    component: WorkspaceView,
                    children: [
                        {
                            path: 'wiki',
                            component: PostListView
                        },
                        {
                            path: 'docs',
                            component: DocsListView
                        }
                    ]
                },
                {
                    path: ':id/wiki/new',
                    component: PostWriterView
                },
                {
                    path: ':id/docs/new',
                    component: DocsWriterView
                },
                {
                    path: 'detail/:id',
                    component: PostDetailView
                },
                {
                    path: 'quiz',
                    component: QuizView,
                    children: [
                        {
                            path: 'new',
                            component: CreateQuiz
                        },
                        {
                            path: ':id',
                            component: TakeQuiz
                        }
                    ]
                }
            ]
        },
        {
            path: '/group',
            component: Group,
            children: [
                {
                    path: 'study',
                    component: Study,
                    children: [
                        {
                            path: ':id',
                            component: PostListView
                        },
                        {
                            path: 'detail/:id',
                            component: PostDetailView
                        },
                        {
                            path: ':id/new',
                            component: PostWriterView
                        },
                        {
                            path: 'quiz',
                            component: QuizView,
                            children: [
                                {
                                    path: 'new',
                                    component: CreateQuiz
                                },
                                {
                                    path: ':id',
                                    component: TakeQuiz
                                }
                            ]
                        }
                    ]
                },
                {
                    path: 'organization',
                    component: Organization,
                    children: [
                        {
                            path: ':id',
                            component: PostListView
                        },
                        {
                            path: 'detail/:id',
                            component: PostDetailView
                        },
                        {
                            path: ':id/new',
                            component: GeneralWriterView
                        },
                        {
                            path: 'quiz',
                            component: QuizView,
                            children: [
                                {
                                    path: 'new',
                                    component: CreateQuiz
                                },
                                {
                                    path: ':id',
                                    component: TakeQuiz
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            path: '/office-life',
            component: OfficeLife,
            children: [
                {
                    path: ':id',
                    component: PostListView
                },
                {
                    path: 'detail/:id',
                    component: PostDetailView
                },
                {
                    path: ':id/new',
                    component: PostWriterView
                },
                {
                    path: 'quiz',
                    component: QuizView,
                    children: [
                        {
                            path: 'new',
                            component: CreateQuiz
                        },
                        {
                            path: ':id',
                            component: TakeQuiz
                        }
                    ]
                },
                {
                    path: 'anonymous-board',
                    component: AnonymousBoard,
                    children: [
                        {
                            path: 'list',
                            component: AnonymousBoardListView
                        },
                        {
                            path: 'new',
                            component: AnonymousBoardWriterView
                        },
                        {
                            path: ':id',
                            component: AnonymousBoardDetailView
                        }
                    ]
                },
                {
                    path: '/login',
                    component: Login
                },
            ]
        },
        {
            path: '/approval',
            component: ApprovalView,
            children:[
                {
                    path: 'requested',
                    component: RequestedApprovalView
                },
                {
                    path: 'requested/:approvalId',
                    component: RequestedApprovalDetailView
                },
                {
                    path: 'received',
                    component: ReceivedApprovalView
                },
                {
                    path: 'received/:requestApprovalId',
                    component: ReceivedApprovalDetailView
                },
                {
                    path: 'new',
                    component: CreateApprovalView
                }
            ]
        },
        {
            path: '/otp-registration',
            component: OtpRegistration
        }
    ]
});

export default router;
