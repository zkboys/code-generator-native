module.exports = {
    // name: '弹框编辑页',
    options: ['添加', '修改', '详情'],
    fieldOptions: ['表单'],
    targetPath: '/front/src/pages/{module-name}/EditModalController.java',
    getContent: config => {
        const { moduleNames: mn, fields, NULL_LINE } = config;
        const ignore = ['id', 'updatedAt', 'createdAt', 'isDeleted'];
        const formFields = fields.filter(item => item.fieldOptions.includes('表单') && !ignore.includes(item.__names.moduleName));

        return `
package com.suixingpay.tas.admin.controller;

import com.suixingpay.ace.data.api.Response;
import com.suixingpay.tas.bo.response.ResponseUtil;
import com.suixingpay.tas.consumer.ai.AiService;
import com.suixingpay.tas.exception.TasException;
import com.suixingpay.tas.exception.TasExceptionCode;
import com.suixingpay.tas.other.ai.domain.ImageBean;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

/**
 * @Description ai接口 --> 图片处理相关接口
 * @Author wangjiangtao
 * @Date 2021/10/14 10:54
 */
@RestController
@RequestMapping("/ai")
@Slf4j
public class AiController {

    @Autowired
    private AiService aiService;

    /**
     * 根据图片url获取图片类型(多个)
     *
     * @param json
     * @return
     */
    @RequestMapping(value = "/getTypeByUrls", method = RequestMethod.POST)
    public Response getTypeByUrls(@RequestBody String[] json) {
        log.info("根据图片url获取图片类型参数:{}", Arrays.toString(json));
        if (log.isDebugEnabled()) {
            log.info("根据图片url获取图片类型参数:{}", Arrays.toString(json));
        }
        if (null == json || json.length < 1) {
            return ResponseUtil.build(TasExceptionCode.VALIDATE_EXCEPTION);
        }

        Response response = null;
        HashSet<String> strings = new HashSet<>(Arrays.asList(json));
        try {
            List<ImageBean> imgInfoByUrls = aiService.getImgInfoByUrls(strings);
            response = ResponseUtil.ok(imgInfoByUrls);

        } catch (TasException e) {
            log.error("业务异常-根据url获取图片类型失败", e);
            response = ResponseUtil.build(TasExceptionCode.IMG_ERROR);
        } catch (Exception e) {
            log.error("系统异常, 根据图片url获取图片类型失败", e);
            response = ResponseUtil.build(TasExceptionCode.IMG_ERROR);
        }
        return response;
    }

}
        
        `;
    },
};
