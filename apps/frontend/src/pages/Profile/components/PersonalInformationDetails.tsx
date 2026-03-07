import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Comment, FoundItem, LostItem, User } from '@lostfound/schema';
import { memo } from 'react';
import PersonalInfoDetailComments from './PersonalInfoDetailComments';
import PersonalInfoDetailFoundList from './PersonalInfoDetailFoundList';
import PersonalInfoDetailLostList from './PersonalInfoDetailLostList';
import PersonalInfoDetailSettingList from './PersonalInfoDetailSettingList';

export default memo(function PersonalInformationDetails({
  userRaw,
  lostItems,
  foundItems,
  comments,
}: {
  userRaw: User;
  lostItems: LostItem[];
  foundItems: FoundItem[];
  comments: Comment[];
}) {
  return (
    <Tabs defaultValue="lost">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="lost">我的失物</TabsTrigger>
        <TabsTrigger value="found">我的招领</TabsTrigger>
        <TabsTrigger value="comments">我的评论</TabsTrigger>
        <TabsTrigger value="settings">账户设置</TabsTrigger>
      </TabsList>
      <TabsContent value="lost" className="mt-6 flex flex-col gap-4">
        <PersonalInfoDetailLostList lostItems={lostItems} />
      </TabsContent>
      <TabsContent value="found" className="mt-6 flex flex-col gap-4">
        <PersonalInfoDetailFoundList foundItems={foundItems} />
      </TabsContent>
      <TabsContent value="comments" className="mt-6 flex flex-col gap-4">
        <PersonalInfoDetailComments comments={comments} />
      </TabsContent>
      <TabsContent value="settings" className="mt-6">
        <PersonalInfoDetailSettingList userRaw={userRaw} />
      </TabsContent>
    </Tabs>
  );
});
