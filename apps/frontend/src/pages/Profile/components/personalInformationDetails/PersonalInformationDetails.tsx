import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '@lostfound/shared';
import { memo } from 'react';
import PersonalInfoDetailComments from './PersonalInfoDetailComments';
import PersonalInfoDetailFoundList from './PersonalInfoDetailFoundList';
import PersonalInfoDetailLostList from './PersonalInfoDetailLostList';
import PersonalInfoDetailPunishments from './PersonalInfoDetailPunishments';
import PersonalInfoDetailSettingList from './PersonalInfoDetailSettingList';

export default memo(function PersonalInformationDetails({
  userRaw,
  isSelf,
  defaultTab = 'lost',
}: {
  userRaw: User;
  isSelf: boolean;
  defaultTab?: string;
}) {
  return (
    <Tabs defaultValue={defaultTab}>
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="lost">我的失物</TabsTrigger>
        <TabsTrigger value="found">我的招领</TabsTrigger>
        <TabsTrigger value="comments">我的评论</TabsTrigger>
        <TabsTrigger value="punishments">处罚记录</TabsTrigger>
        <TabsTrigger value="settings">账户设置</TabsTrigger>
      </TabsList>
      <TabsContent value="lost" className="mt-6 flex flex-col gap-4">
        <PersonalInfoDetailLostList userId={userRaw.id} isSelf={isSelf} />
      </TabsContent>
      <TabsContent value="found" className="mt-6 flex flex-col gap-4">
        <PersonalInfoDetailFoundList userId={userRaw.id} isSelf={isSelf} />
      </TabsContent>
      <TabsContent value="comments" className="mt-6 flex flex-col gap-4">
        <PersonalInfoDetailComments userId={userRaw.id} />
      </TabsContent>
      <TabsContent value="punishments" className="mt-6 flex flex-col gap-4">
        <PersonalInfoDetailPunishments userId={userRaw.id} />
      </TabsContent>
      <TabsContent value="settings" className="mt-6">
        <PersonalInfoDetailSettingList userRaw={userRaw} />
      </TabsContent>
    </Tabs>
  );
});
